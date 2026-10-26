import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIcs, normalizeApprovedEvent, mergeEvents, safePublicUrl } from '../src/calendar.mjs';

const source = {
  id: 'demo', organization: 'Example Organization',
  sourcePage: 'https://example.org/events',
};
const from = new Date('2026-11-01T00:00:00Z');
const until = new Date('2026-11-10T00:00:00Z');
const header = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CoCoalition PoC Tests//EN\n';
const footer = 'END:VCALENDAR\n';

test('imports a single event with attribution and a stable ID', () => {
  const ics = header + [
    'BEGIN:VEVENT', 'UID:festival-1',
    'DTSTAMP:20261026T120000Z',
    'DTSTART:20261102T150000Z', 'DTEND:20261102T170000Z',
    'SUMMARY:Neighborhood Festival', 'LOCATION:Community Park',
    'END:VEVENT', '',
  ].join('\n') + footer;
  const events = normalizeIcs(ics, source, from, until);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, 'Neighborhood Festival');
  assert.equal(events[0].sourceUrl, 'https://example.org/events');
  assert.equal(events[0].start, '2026-11-02T15:00:00.000Z');
  assert.equal(events[0].id, normalizeIcs(ics, source, from, until)[0].id);
});

test('honors RRULE, EXDATE and a moved RECURRENCE-ID instance', () => {
  const ics = header + [
    'BEGIN:VEVENT', 'UID:recurrence-1', 'DTSTAMP:20261026T120000Z',
    'DTSTART:20261101T150000Z', 'DTEND:20261101T160000Z',
    'RRULE:FREQ=DAILY;COUNT=3',
    'EXDATE:20261102T150000Z', 'SUMMARY:Cleanup', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:recurrence-1', 'DTSTAMP:20261026T120000Z',
    'RECURRENCE-ID:20261103T150000Z',
    'DTSTART:20261103T180000Z', 'DTEND:20261103T190000Z',
    'SUMMARY:Cleanup moved', 'END:VEVENT', '',
  ].join('\n') + footer;
  const events = normalizeIcs(ics, source, from, until);
  assert.deepEqual(events.map(e => e.start), [
    '2026-11-01T15:00:00.000Z',
    '2026-11-03T18:00:00.000Z',
  ]);
  assert.equal(events[1].title, 'Cleanup moved');
});

test('does not publish cancelled or unapproved events', () => {
  const cancelled = header + [
    'BEGIN:VEVENT', 'UID:cancelled-1', 'DTSTAMP:20261026T120000Z',
    'DTSTART:20261103T150000Z', 'DTEND:20261103T160000Z',
    'SUMMARY:Cancelled Meetup', 'STATUS:CANCELLED', 'END:VEVENT', '',
  ].join('\n') + footer;
  assert.deepEqual(normalizeIcs(cancelled, source, from, until), []);
  assert.equal(normalizeApprovedEvent({
    id: '1', status: 'draft', visibility: 'public', organization: 'PTO',
    title: 'Proposed event', sourceUrl: 'https://example.org/approved',
    start: '2026-11-03T15:00:00Z', end: '2026-11-03T16:00:00Z',
  }, from, until), null);
});

test('rejects unsafe source links and duplicate canonical IDs', () => {
  assert.equal(safePublicUrl('javascript:alert(1)'), null);
  assert.equal(safePublicUrl('http://example.org'), null);
  const item = { id: 'same', start: '2026-11-02T15:00:00.000Z', title: 'Event' };
  assert.throws(() => mergeEvents([[item], [item]]), /Duplicate canonical/);
});

test('keeps local calendar days and Chicago standard-time offsets', () => {
  const ics = header + [
    'BEGIN:VEVENT', 'UID:allday-1', 'DTSTAMP:20261026T120000Z',
    'DTSTART;VALUE=DATE:20261101', 'DTEND;VALUE=DATE:20261102',
    'SUMMARY:All-day gathering', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:chicago-1', 'DTSTAMP:20261026T120000Z',
    'DTSTART;TZID=America/Chicago:20261102T100000',
    'DTEND;TZID=America/Chicago:20261102T110000',
    'SUMMARY:Local morning', 'END:VEVENT', '',
  ].join('\n') + footer;
  const events = normalizeIcs(ics, source, from, until);
  const day = events.find(e => e.title === 'All-day gathering');
  const local = events.find(e => e.title === 'Local morning');
  assert.equal(day.allDay, true);
  assert.equal(day.localDate, '2026-11-01');
  assert.equal(local.start, '2026-11-02T16:00:00.000Z');
});
