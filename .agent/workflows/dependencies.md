# Project dependency map and prototype usage

Reviewed against repository declarations: 2026-10-29.

Each application owns its dependency record and builds independently. Do not create shared runtime
packages or cross-repository build requirements to maintain this inventory.

| Owner | Dependency record | Responsibility |
|---|---|---|
| community-coalition | This document | Coordination and preserved iCalendar prototype. |
| community-coalition-frontend | [Frontend workflow](https://github.com/ctharvey/community-coalition-frontend/blob/feat/calendar-foundation/.agent/workflows/dependencies.md) | Astro/React SSR, UI tests and generated TypeScript contracts. |
| community-coalition-api | [API workflow](https://github.com/ctharvey/community-coalition-api/blob/feat/calendar-foundation/.agent/workflows/dependencies.md) | Spring API/security, PostgreSQL/Flyway, identity provider and integration tests. |

Links target current review branches; update them when those branches are merged or replaced.

## Preserved calendar prototype

Version authority: apps/calendar/package.json and apps/calendar/package-lock.json.

| Dependency / component | Version | What we use |
|---|---|---|
| Node.js | >=22 | Native feed fetch, crypto hashes for occurrence IDs, static build/filesystem and node:test. |
| node-ical | 0.27.3 | sync.parseICS and expandRecurringEvent for feeds, recurrence, exclusions, moved instances, date-only events and time zones. Our normalization retains attribution and filters cancellations. Lockfile reports Apache-2.0. |
| rrule-temporal (transitive) | 2.2.8 locked | Recurrence support brought in by node-ical, not a separate integration. Lockfile reports MIT. |
| temporal-polyfill (transitive) | 1.0.6 locked | Temporal support brought in by node-ical. Lockfile reports MIT; remaining transitives stay in the lockfile. |

Neither new application currently imports node-ical. Preserve recurrence, exception, cancellation,
time-zone and attribution fixtures when integrating it; backend APIs own authoritative writes/publication.

## Status distinctions

- FullCalendar is proposed for frontend presentation, not installed. Record the actual version/plugins,
  features used and license review in its owning workflow if adopted.
- Keycloak is implemented in the API repo. Facebook sign-in/Page authorization is separate work.
- Caddy is an intended deployment component, not a production deployment performed by this handoff.
- License metadata is evidence, not a complete transitive security/license audit. Original-code licensing
  and public-release review remain separate work.

## Maintenance workflow

Update this record in the same change whenever adding, removing, upgrading or changing dependency usage,
including build/test tools, images and external integrations. Read declarations and actual call sites.
Record purpose, features used, version authority, limitations and installed/proposed/mocked status.

For additions/upgrades, check upstream compatibility, licensing and security advisories; record review
sources/date and unresolved concerns. Document important transitive behavior without duplicating lockfiles.
Keep other repositories' inventories as links to their owning records. Remove obsolete entries and update
affected architecture/setup docs and changelog. Run checks appropriate to the changed usage;
documentation-only edits need link/manifest consistency checks, not application tests.
