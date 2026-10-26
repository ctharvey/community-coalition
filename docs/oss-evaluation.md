# OSS evaluation and build-vs-borrow register

**Status:** Research candidates, **not** final selections. Revalidate versions, licenses, and capabilities before deployment.

| Need | Project | Stack / license | Borrow vs build | Main concern |
| --- | --- | --- | --- | --- |
| Inter-org coordination | [Hylo](https://github.com/Hylozoic/hylo) | React, Node/Sails, GraphQL; Apache-2.0 | Borrow group network, event posts, requests/offers, resources | No inbound public calendar sync, complexity of fork, hosted API |
| Public calendar ingestion | [Community Calendar](https://github.com/judell/community-calendar) | Python, JS, GitHub Actions/Supabase; Apache-2.0 | Reuse collector/dedupe/curation patterns or system | Scrapers and classifications need local sources, reliability review |
| ICS import | [node-ical](https://github.com/jens-maus/node-ical) | Node.js; Apache-2.0 | Reuse parsing and recurrence expansion | Must still build ingestion/safety/provenance |
| Basic signups | [OpenSignup](https://github.com/richshaw/OpenSignup) | Next.js/TypeScript, Postgres; AGPL-3.0 | Strong candidate as whole separate service | Young; test multiple organizations/privacy/roles |
| Advanced volunteer shifts | [Ephios](https://github.com/ephios-dev/ephios) | Django/Python; MIT | Reuse separately with deep links/API | More complex than a signup sheet |
| Event check-in / volunteer gear | [Voluntify](https://github.com/reneweiser/voluntify) | Laravel/PHP; inspect licensing/dependencies | Evaluate as separate pilot | Early-stage; offline sync and permissions require validation |
| Paid registration, merchandise | [Hi.Events](https://github.com/HiEventsDev/Hi.Events) | Laravel/React/TS; AGPL-3.0 + additional attribution terms | Reuse organizer Stripe Connect, checkout, ticketing, order flows | Verify multi-org isolation, capabilities and license requirements |
| Formal docs/wiki | [BookStack](https://www.bookstackapp.com/) | PHP/Laravel; MIT | Separate optional knowledge service | Another login/service to maintain |
| Asset checkouts | [Snipe-IT](https://github.com/grokability/snipe-it) | PHP/Laravel; AGPL | Probably defer; needs emerge first | Heavy solution for a few tables/tents |
| Full nonprofit CRM | [CiviCRM](https://civicrm.org/) | PHP; open source | Consider only if member/donor management becomes core | Operational overhead and scope creep |

## Candidate decision questions

### Hylo

- Can organizers cross-post and co-manage real events without confusing approval?
- Do production group settings permit public events to be viewed by logged-out visitors?
- Can the public calendar safely ingest only approved public content, with no private group-feed exposure?
- Is hosted API use available and under which plan? Can project data be exported?

### Public calendar

- How many real partner feeds are published? Which require scraping or manual curation?
- How are event cancellation, recurrence, and duplicates handled?
- Is a minimal TypeScript collector easier to operate than Community Calendar's Python/Supabase workflow?

### Volunteer signup

- Can participants signup without an account and receive an email confirmation/reminder?
- Can each organization manage its own rosters without seeing another organization's data?
- Are email consent, retention, spam prevention, rate limiting, and deletion sufficient?
- Does the tool need background-check status? Usually **no**: school screening remains with the school.

### Payments and tickets

- Can each legitimate organization connect its **own** Stripe account securely?
- Are direct charges used and are reporting/refunds scoped by the recipient?
- Can the site's operator avoid being the merchant of record or financially responsible for partner charges?
- Are small donated amounts/low-cost concessions economical after card fees?
- Which OSS features are free under the actual license versus commercial/enterprise extensions?

## Current preference

**Evaluate modular integration first:** Hylo for organizer coordination, Community Calendar as aggregation starting point, OpenSignup for guest signups, and Hi.Events for organization-owned paid event transactions. BookStack/Ephios only when the pilot shows a need. Use the actual pilot to decide, not feature checklists alone.
