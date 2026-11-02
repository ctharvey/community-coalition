import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalizeIcs, normalizeApprovedEvent, mergeEvents } from './calendar.mjs';

const root = new URL('../', import.meta.url);
const load = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const MAX_BYTES = 2 * 1024 * 1024;

async function downloadVerifiedFeed(source) {
  const url = new URL(source.feedUrl);
  if (source.kind !== 'ics' || source.status !== 'active'
      || source.verifiedPublic !== true || !source.feedUrl
      || url.protocol !== 'https:' || url.username || url.password
      || (url.port && url.port !== '443')
      || !Array.isArray(source.allowedHosts)
      || !source.allowedHosts.includes(url.hostname)) {
    throw new Error('Feed has not been verified and allowlisted: ' + source.id);
  }

  const response = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: 'text/calendar', 'User-Agent': 'CommunityCoalitionCalendarPoC/0.1' },
  });
  if (!response.ok) throw new Error(source.id + ': HTTP ' + response.status);
  if (Number(response.headers.get('content-length') || 0) > MAX_BYTES) {
    throw new Error(source.id + ': response too large');
  }

  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) throw new Error(source.id + ': response too large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error(source.id + ': not a calendar');
  return text;
}

async function main() {
  const sources = await load('data/sources.json');
  const approved = await load('data/approved-events.json');
  if (!Array.isArray(sources) || !Array.isArray(approved)) {
    throw new Error('Invalid input registry');
  }
  const today = new Date();
  const from = new Date(today.getTime() - 86_400_000);
  const until = new Date(today.getTime() + 120 * 86_400_000);
  const activeFeeds = sources.filter(s => s.kind === 'ics' && s.status === 'active');

  // All-or-nothing: a failed feed never replaces a previously published good snapshot.
  const imported = await Promise.all(activeFeeds.map(async source =>
    normalizeIcs(await downloadVerifiedFeed(source), source, from, until)));
  const curated = approved.map(item => normalizeApprovedEvent(item, from, until))
    .filter(Boolean);
  const events = mergeEvents([...imported, curated]);

  const output = {
    generatedAt: today.toISOString(),
    mode: 'prototype',
    sources: activeFeeds.map(s => ({
      id: s.id, organization: s.organization, sourcePage: s.sourcePage,
      status: 'ok',
    })),
    events,
  };
  const dest = fileURLToPath(new URL('public/events.json', root));
  await mkdir(fileURLToPath(new URL('public/', root)), { recursive: true });
  await writeFile(dest + '.tmp', JSON.stringify(output, null, 2) + '\n');
  await rename(dest + '.tmp', dest);
  console.log('Generated ' + events.length + ' verified/approved public events');
}

main().catch(error => {
  console.error('Calendar build failed without replacing previous output:', error);
  process.exitCode = 1;
});
