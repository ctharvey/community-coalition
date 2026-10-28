# Current state and confirmed findings

**Snapshot date:** 2026-10-28. Custom application architecture is approved; see architecture.md and decisions.md.
Separate frontend/API foundations are under review on feat/calendar-foundation. The earlier findings below
remain research, not a production deployment, legal determination or organization endorsement.

## Real-world context

- Brookfield Estates HOA organizes community events but does not itself fundraise at those events.
- A possible joint neighborhood garage sale would use the elementary-school parking lot, subject to PfISD permission; Wieland PTO would handle school/district interface and might fundraise through food/drink sales.
- A broader coalition would seek collaboration among existing neighborhood groups, schools/PTOs, Northtown MUD, and apartment communities.
- Existing groups should retain legal authority and finances; the coalition would primarily coordinate and publish.

These are project premises from exploratory conversations. Permission, governance documents, tax status, insurance coverage, and all proposed partner roles require independent confirmation.

## Software findings

### Hylo

Repo: https://github.com/Hylozoic/hylo · Website: https://www.hylo.com/features

Verified features include independent and nested groups, peer relationships, cross-posted events/discussions/requests/offers, event RSVPs, outward iCalendar subscription feeds, resource posts, curated collections, editable pages, and projects. Some content can be imported by CSV.

Important gaps and caveats:
- No native automatic aggregation of external iCalendar/Google/Outlook event sources found in the audited code.
- Recurring event authoring and in-app project tasks are publicly listed as coming soon (as of this snapshot).
- Production-created groups default to a restrictive public-post setting; public/no-login discovery requires specific acceptance testing.
- Group event subscription feeds appear to aggregate group events rather than enforcing a public-only filter in the generator. Treat links as potentially sensitive until verified.
- Hosted API access is advertised as an upcoming Hylo Pro capability; don't assume the free service permits custom authenticated integration.
- The OSS repo is a React/Node monorepo with legacy Sails/Bookshelf backend architecture; a self-hosted fork creates significant maintenance work.

Code entry points: [Group model](https://github.com/Hylozoic/hylo/blob/dev/apps/backend/api/models/Group.js), [Post public visibility](https://github.com/Hylozoic/hylo/blob/dev/apps/backend/api/models/post/setupPostAttrs.js), [Group views](https://github.com/Hylozoic/hylo/blob/dev/apps/backend/api/models/GroupView.js), [CSV import](https://github.com/Hylozoic/hylo/blob/dev/apps/web/src/routes/GroupSettings/ImportExportSettingsTab/ImportExportSettingsTab.js).

### Event aggregation

[Community Calendar](https://github.com/judell/community-calendar) implements community-wide ingestion, curator workflows, normalization, duplicate handling, source attribution, search, and feed-health concepts. [node-ical](https://github.com/jens-maus/node-ical) handles iCalendar parsing, time zones, recurrence, and exceptions if a TypeScript importer is preferred.

### Low-cost community utilities

[OpenSignup](https://github.com/richshaw/OpenSignup) is an ad-free Next.js/TypeScript signup service for volunteer shifts, snacks, and supplies. It currently has a young release line (v0.1.0 on its public homepage); production, abuse-prevention, organizational tenant isolation, email deliverability, and privacy need assessment.

[Ephios](https://github.com/ephios-dev/ephios) is a separate Django service with richer volunteer scheduling, shifts, qualifications, and APIs.

[Hi.Events](https://github.com/HiEventsDev/Hi.Events) is an event ticketing/registration product (Laravel/React) with organizer-level Stripe Connect integration in its source. Its AGPL-3.0 license includes attribution terms; enterprise features are separately licensed.

### Payments

[Stripe Connect](https://stripe.com/connect) can support organization-owned connected accounts, Stripe-managed onboarding, and direct charges. Stripe's pricing model where Stripe bills connected accounts directly advertises no additional Connect fees to the platform; ordinary payment processing remains payable. For direct charges, the connected organization generally carries processing/refund/dispute responsibilities; exact risk depends on Connect account configuration.

## Unknowns requiring tests or external confirmation

1. Whether proposed partner websites expose stable public iCalendar feeds.
2. PfISD facility/event procedures for the proposed school parking lot.
3. Exact PTO incorporation, EIN, exemption, bank, insurance, and governance status.
4. Brookfield HOA board authorization and applicable CC&R/insurance/contracting constraints.
5. Northtown MUD's scope of authority and willingness to collaborate.
6. Public/private event behavior in hosted Hylo.
7. Hi.Events self-hosted multi-organization isolation and Stripe onboarding behavior.
8. A durable operator/legal entity for a public multi-organization service.

## Reliability note

Facts about upstream software are time-sensitive and should be rechecked before implementation. Separate published vendor claims from verified behavior and actual local test results.
