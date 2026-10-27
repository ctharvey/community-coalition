# Local Codex handoff — community calendar (2026-10-26)

**Task:** Continue Priority 1 of the Pflugerville Community Coalition project in a local Windows Codex work thread. This handoff is about local implementation, not production deployment. No participant organization is represented as having officially joined the platform.

## Repository and starting point

- Repo: https://github.com/ctharvey/community-coalition
- Base: `main` (planning/research only)
- Working branch: `feat/calendar-poc`
- Draft PR: https://github.com/ctharvey/community-coalition/pull/2
- Tracking issue: https://github.com/ctharvey/community-coalition/issues/1
- Current tests: GitHub Actions succeeded on commit `7b5230c8f0b48ee76206379b03000794ff7c8791` (2026-10-26).
- Read `CONTRIBUTING.md`, `docs/vision-and-scope.md`, `docs/roadmap.md`, `docs/architecture.md`, `apps/calendar/README.md`, and `docs/calendar/source-audit-2026-10-26.md` before editing.
- Follow existing repository instructions and preserve unrelated work.

## Clone and verify on Windows

In PowerShell, from **the user's chosen development directory** (do not assume its path):

```powershell
git clone https://github.com/ctharvey/community-coalition.git
cd community-coalition
git switch feat/calendar-poc
cd apps/calendar
npm install
npm test
npm run build
```

Node.js 22+ required. Install dependencies normally; no secrets are needed for current tests. The generated static site is `apps/calendar/public/`. Do not invent or publish real events to make the demo look populated.

## New product requirement from Charlie (2026-10-26)

**Most intended local organizations announce events directly on Facebook.** Treat Facebook-first intake as a core P1 pathway, not an edge case.

Facebook Page/User event reads are not broadly available through Graph API; Meta's Event reference currently limits access to Facebook Marketing Partners:
https://developers.facebook.com/docs/graph-api/reference/event/

Do **not** plan on scraping Facebook, reusing a signed-in browser session to bypass access limits, or automatically creating Facebook events without an officially supported, approved integration. Maintain source links and org authority. Test any official API capability against Meta's current permissions and platform terms before promising it.

### Intended workflow

1. Authorized organizer may **upload flyer image/PDF or screenshot**, or **paste a public Facebook post/event URL** (a URL alone may require the organizer to attach the content; do not promise reliable Facebook URL extraction).
2. Store the supplied source URL and original upload as draft provenance, with privacy, copyright and retention checks. Reject huge, malicious, unsupported, or private content. Do not publish uploaded files by default.
3. Run vision/text extraction using **Luna, standard processing by default** (Charlie previously rejected Flex as the default). Return structured fields: title, organization, dates, start/end times, time zone, address/venue, admission/RSVP info, original link, and unknown/ambiguous items.
4. Show a **human-editable confirmation form** before an organizer can submit. Missing or ambiguous dates/times must be flagged; never silently invent them. A flyer with multiple events must support splitting into multiple drafts.
5. Make publication a separate authorized transition: `draft -> confirmed -> submitted -> approved -> published`. Approval can initially be a curator action, but design for an organization's own authorized admins to manage their events and cancellations.
6. After publication, public calendar remains **viewable without registration** and displays the actual organizer, source attribution, and current event status.
7. Any cross-post back to Facebook is a **separate later feasibility spike**; don't make this a P1 dependency.

Privacy boundary: no student names, resident rosters, Facebook account tokens, bank details or school volunteer clearance records in public calendar data. Keep drafts private to appropriate authenticated organizers; unauthenticated visitors can only read approved public events.

## Existing calendar vertical slice

`apps/calendar` has:
- `src/calendar.mjs`: normalization through Apache-2.0 `node-ical`; RRULE, exclusions, overrides, cancellation, source links, all-day date handling.
- `src/build.mjs`: restricted operator-defined HTTPS ICS intake. Build fails before replacing output if any active source fails.
- `data/sources.json`: Brookfield, PfISD, Wieland PTO, Ruth Barron PTO, Northtown MUD **candidates**, disabled pending source verification.
- `data/approved-events.json`: initially empty; only public/approved entries become visible.
- `public/index.html`: static no-login event list with search and organization filter.
- `test/calendar.test.mjs`: import/recurrence/override/cancellation/all-day/Chicago timezone tests.
- GitHub CI in `.github/workflows/calendar-poc.yml` currently passes.

Do not disable the safety checks or turn on candidate sources merely to populate the demo.

## Recommended local work sequence

1. Inspect repository, confirm tests locally, document any environment problems.
2. Design and implement an end-to-end **mocked** flyer/screenshot submission vertical slice with local draft state and explicit editable confirmation. Establish exact request/response and validation schemas before integrating model credentials. Preserve no-account public browsing.
3. Decide whether to add a small JS/TS server and SQLite/Postgres for authorized organizer drafts and review or to use another practical OSS component. Document tradeoffs; prefer portable, modest operations.
4. Add file-type, size and content validation, org-admin authorization, per-org isolation, XSS-safe display, idempotent publish actions and event edit/cancel workflow. Do not expose upload or draft storage publicly.
5. Add provider abstraction for Luna standard extraction; make model integration an opt-in configured backend service. Never commit API keys or upload minors' private data to unapproved processors.
6. Verify actual PfISD and Brookfield calendar feed URLs; do not confuse a publicly documented iCal feature with a verified working endpoint.
7. Reassess adapting Community Calendar's Apache-2.0 curator and poster-capture patterns: https://github.com/judell/community-calendar . Borrow selectively with license attribution if copying upstream code.
8. Add unit/integration tests (vague dates, timezone/DST, multiple events in flyer, correction before submit, URL-only unsupported extraction, private drafts, organization access, cancellations).
9. Keep changes on a feature branch and PR; update the decision log only for actual decisions. Do not merge or deploy until instructed.

## Acceptance for next checkpoint

- Local clone boots and tests pass.
- An organizer can provide a synthetic flyer, receive **mock extracted** event fields, edit them and confirm; no event goes public just from extraction.
- Unapproved draft is inaccessible to unauthenticated public users.
- Preview correctly identifies organization and source link.
- Tests prove invalid uploads and incomplete date/time require correction.
- Follow-up report clearly states implemented, tested, deferred, security/authority gaps and next decision needed.

## Open decisions for Charlie

- Original code license for this public repo (currently undecided).
- Who operates the system and controls production organizer verification, hosting and uploads.
- Pilot organization authorization for publishing its name/events. Welcoming collaboration in comments is not equivalent to data-publication authorization.
- Storage and retention policies for uploaded flyers, screenshots and generated drafts.
- Which backend/auth/hosting option to commit to after a local demo.

**Important:** This handoff is a task specification. It cannot itself create a new local Codex work thread or clone files onto Charlie's PC.
