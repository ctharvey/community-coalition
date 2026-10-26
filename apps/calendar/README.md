# Community Calendar proof of concept

This is a **non-production** vertical slice for Priority 1, intentionally separate from Hylo and all payment/volunteer systems. It does **not** indicate that Brookfield, any PTO, PfISD or Northtown MUD has agreed to participate.

## Run

Requires Node.js 22 or newer.

```bash
cd apps/calendar
npm install
npm test
npm run build
npx serve public
```

Open the address printed by the static file server. Do not deploy the draft without a review of its privacy, authorization, security and license choices.

## Data sources

- `data/sources.json`: candidate organizations. None are enabled by default. Before enabling an ICS entry, obtain the actual **public** ICS URL, verify it contains no private events, get appropriate organizational approval, set `status` to `active`, `verifiedPublic` to `true`, and set `allowedHosts` to the hostname of the approved HTTPS feed.
- `data/approved-events.json`: curator-approved **public** event records, initially empty. Records marked `draft` or nonpublic will never be published by the build.
- `public/events.json`: generated static snapshot. The public page reads this file without login.

Example curated entry (illustrative only; don't publish without genuine approval):

```json
{
  "id": "example-approved-event",
  "status": "approved",
  "visibility": "public",
  "organization": "Example Organization",
  "title": "Example Neighborhood Gathering",
  "start": "2026-11-07T15:00:00Z",
  "end": "2026-11-07T17:00:00Z",
  "location": "Example Park",
  "sourceUrl": "https://example.org/event"
}
```

## Current boundaries and unfinished work

The build imports only explicitly approved HTTPS feeds; there is no untrusted user-facing feed creation. If any active feed fails, it exits unsuccessfully **before replacing** the last good published snapshot. It normalizes recurring events and cancelled instances, keeps source attribution and renders a responsive public listing.

This is **not a public launch**. Remaining gates:

1. Validate two real independent sources and obtain partner approval; check that feeds contain public events only.
2. Verify timezone/all-day and recurrence behavior against the real feeds, including reschedules, cancellations and updates.
3. Add per-source health history, change-detection alerts and cautious cross-source duplicate review. Current duplicate handling is only within each canonical source/occurrence.
4. Secure remote fetching against DNS rebinding/private-IP resolution (the prototype is restricted to operator-committed URLs; production needs an SSRF-safe fetcher).
5. Implement the organizer flyer-upload → Luna extraction → editable confirmation → authenticated approval flow. No direct Facebook publishing is assumed.
6. Agree on original-code licensing, operator/hosting, account succession, data retention and incident response.

## Why this split?

The Apache-2.0 [Community Calendar](https://github.com/judell/community-calendar) project informed the source registry and curator pattern. It is a strong upstream candidate, but its complete pipeline includes Python, Supabase and XMLUI. We are prototyping a smaller Apache-2.0 [node-ical](https://github.com/jens-maus/node-ical)-powered ingestion first and will reassess upstream code reuse after real-source tests. No upstream source code has been copied.
