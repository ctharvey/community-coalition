import { createHash } from 'node:crypto';
import ical from 'node-ical';

function valueOf(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field.val === 'string') return field.val;
  return '';
}

export function safePublicUrl(raw) {
  if (!raw) return null;
  try {
    const parsed = new URL(valueOf(raw));
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password
      ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function eventId(sourceId, uid, recurrenceKey) {
  return createHash('sha256').update([sourceId, uid, recurrenceKey].join('\u0000'))
    .digest('hex').slice(0, 24);
}

function localDay(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function validDate(value) {
  return value instanceof Date && !Number.isNaN(value.valueOf());
}

export function normalizeIcs(icsText, source, from, until) {
  if (!(validDate(from) && validDate(until) && from < until)) {
    throw new Error('Invalid event window');
  }
  const parsed = ical.sync.parseICS(icsText);
  const events = new Map();

  for (const item of Object.values(parsed)) {
    if (item?.type !== 'VEVENT' || !validDate(item.start) || !item.uid) continue;
    if (String(item.status || '').toUpperCase() === 'CANCELLED') continue;

    // node-ical handles recurrence, date-only events, exclusions, moved instances and DST.
    const instances = ical.expandRecurringEvent(item, {
      from,
      to: until,
      expandOngoing: true,
      excludeExdates: true,
      includeOverrides: true,
    });
    for (const instance of instances) {
      if (!validDate(instance.start) || !validDate(instance.end)) continue;
      if (instance.start >= until || instance.end < from) continue;
      const actual = instance.event ?? item;
      if (String(actual.status || '').toUpperCase() === 'CANCELLED') continue;
      const uid = String(item.uid);
      const recurrenceKey = instance.isOverride && validDate(actual.recurrenceid)
        ? actual.recurrenceid.toISOString() : instance.start.toISOString();
      const id = eventId(source.id, uid, recurrenceKey);

      const sourceUrl = safePublicUrl(actual.url) ?? safePublicUrl(item.url)
        ?? safePublicUrl(source.sourcePage);
      if (!sourceUrl) continue;
      events.set(id, {
        id,
        organization: source.organization,
        title: valueOf(actual.summary) || valueOf(item.summary) || 'Untitled event',
        description: valueOf(actual.description) || valueOf(item.description) || '',
        start: instance.start.toISOString(),
        end: instance.end.toISOString(),
        allDay: Boolean(instance.isFullDay),
        localDate: instance.isFullDay ? localDay(instance.start) : null,
        location: valueOf(actual.location) || valueOf(item.location) || '',
        status: String(actual.status || item.status || 'CONFIRMED').toUpperCase(),
        sourceId: source.id,
        sourceUrl,
        originalUid: uid,
        occurrenceKey: recurrenceKey,
      });
    }
  }

  return [...events.values()].sort((a, b) => a.start.localeCompare(b.start));
}

export function normalizeApprovedEvent(record, from, until) {
  if (record?.status !== 'approved' || record?.visibility !== 'public') return null;
  if (!record.id || !record.organization || !record.title || !record.sourceUrl) return null;
  if (!safePublicUrl(record.sourceUrl)) return null;
  const start = new Date(record.start);
  const end = new Date(record.end);
  if (!validDate(start) || !validDate(end) || end < start) return null;
  if (start >= until || end < from) return null;

  return {
    id: 'manual-' + String(record.id),
    organization: String(record.organization),
    title: String(record.title),
    description: String(record.description || ''),
    start: start.toISOString(),
    end: end.toISOString(),
    allDay: Boolean(record.allDay),
    localDate: record.allDay ? String(record.start).slice(0, 10) : null,
    location: String(record.location || ''),
    status: 'CONFIRMED',
    sourceId: 'curated',
    sourceUrl: safePublicUrl(record.sourceUrl),
    originalUid: null,
    occurrenceKey: null,
  };
}

export function mergeEvents(lists) {
  const deduped = new Map();
  for (const entry of lists.flat()) {
    if (deduped.has(entry.id)) throw new Error('Duplicate canonical event ID: ' + entry.id);
    deduped.set(entry.id, entry);
  }
  return [...deduped.values()].sort((a, b) =>
    a.start.localeCompare(b.start) || a.title.localeCompare(b.title));
}
