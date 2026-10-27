# Architecture options and integration boundaries

**Status:** Owner-stated architectural direction; implementation and hosting choices remain open. No platform is deployed.

## Intended deployment and shared brand

Present the services as one recognizable community platform: a consistent name, visual identity, navigation, and accessible design across apps. Use separate subdomains under a domain chosen by the operator, for example `calendar.example.org`, `volunteer.example.org`, and `community.example.org`. These are illustrative placeholders, not registered or selected domains. Account-free public calendar viewing and volunteer participation remain goals; a common visual identity does not imply a shared account or partner endorsement.

Run each self-hosted app in its own container and the shared platform database in a separate container. A reverse proxy can route subdomains to the appropriate app and terminate HTTPS. The database should be on an internal network, with persistent storage, backups and tested restores; it should not be exposed publicly. This is an architecture goal, not an existing deployment.

```text
Browser -> HTTPS reverse proxy -> calendar subdomain  -> calendar container
                               -> volunteer subdomain -> signup container
                               -> community subdomain -> collaboration service
                                      |                 |
                                      +-> approved service interfaces
                                              |
                             shared platform database container
```

The shared database can hold platform-owned organization, approved-event and integration-reference data. Data ownership, authentication and per-organization authorization must be enforced on every access path, using least-privilege service credentials and appropriate isolation. Public views must exclude drafts and volunteer details. Sharing one database process does not require every app to read or write every table: use explicit ownership, separate schemas or databases where appropriate, and service APIs or events for cross-app changes.

Hylo is the intended community and organizer identity foundation, subject to a **hosted pilot** and integration validation; OpenSignup and Hi.Events remain candidates. See the [authentication and integration investigation](hylo-auth-integration-2026-10-26.md). Their own persistence requirements, supported integration interfaces, branding capabilities, and licenses need verification before any shared-database integration. A hosted service may retain its own database; do not assume third-party applications can safely use the platform database directly or that separate containers alone provide tenant isolation. Payments remain controlled by each organization.

Open decisions include the real domain and subdomain names, visual identity, operator and hosting, database engine and schema ownership, identity and access management, integration contracts, secrets, backup and recovery, retention, and any high-availability needs. Establish these through a local proof of concept before public deployment.

## Recommended conceptual split

```text
Public organization calendars / approved submissions
        -> source collector & curator review
        -> normalized approved public event catalogue
        -> public website (no account required)
                    |
                    +---- original organization/event link
                    +---- organizer collaboration links (when public)

Independent organizations -> coalition collaboration and organizer identity (Hylo intended; pilot pending)
                           -> shared documents / requests / offers
                           -> event-related signup links (OpenSignup candidate)
                           -> approved paid event links (Hi.Events candidate)

Paid event -> seller organization's Stripe connected account -> seller's bank
```

Important: the public catalogue is **not** a mirror of private organizer calendars.

## Source-of-truth boundaries

- **Partner organization** owns its event description, permission decisions, operating contacts, and financial obligations.
- **Calendar aggregator** stores source provenance, normalized public event metadata, cache/review state, and a stable reference back to the primary source. It must not silently override the source with stale local edits.
- **Hylo or other hub** owns organizer discussions and opt-in collaboration content, not school/student data.
- **OpenSignup** owns signup slots and volunteer contact records; access should be scoped to each legitimate organizer.
- **Hi.Events / Stripe** owns order/payment details; the community calendar only needs public links and non-sensitive aggregate data.

## Minimal domain model (illustrative)

```text
Organization(id, name, type, service_area, verification_status, approved_contact_roles)
CalendarSource(id, organization_id, source_url, fetch_policy, last_success, public_only)
Event(id, source_id, source_uid, occurrence_id, starts_at, ends_at,
      timezone, venue, public_status, last_verified_at, source_url)
Collaboration(id, event_id, participant_org_id, participation_status, approved_by)
SignupLink(id, event_id, managing_org_id, provider, external_id, public_url)
PaymentConnection(org_id, stripe_account_id, charges_enabled, payouts_enabled, connected_by)
```

**Not** stored in our database: bank numbers, identity documents, raw payment card details, school volunteer clearances, student records.

## Calendar ingestion requirements

- Allowlisted feed URLs, HTTP timeouts, response size caps, SSRF-safe network access.
- Conditional fetch (ETag/Last-Modified), retry/backoff, source-health warnings.
- Recurrence expansion with `UID`, `RECURRENCE-ID`, exceptions, canceled instances, and daylight-saving handling.
- Stable dedupe by source and event ID, with cautious cross-source duplicate review.
- Provenance shown to residents, human moderation where source quality is low.
- Do not ingest an access-token-protected or private group feed into the public calendar.

## Stripe Connect integration option

Use **Stripe-managed connected-account onboarding** and **direct charges**, where the seller organization is the recipient/merchant. The server must derive the connected account from the authorized item's organization; browser input cannot choose or override the recipient. Handle Connect webhooks with signature validation, idempotency, and account scoping.

For the first version, enforce **one recipient organization per checkout**; multi-recipient carts generally change payment flows and risk. No platform application fee initially. The organization manages its own refunds, dispute response, taxes, and receipts, subject to final account configuration.

Relevant: https://docs.stripe.com/connect and https://stripe.com/connect/pricing

## Build/hosting options

**Option A: modular hosted pilot (lowest commitment).** Hosted Hylo, standalone public calendar, hosted or self-hosted signup forms, and external organization-owned payment links. Risk: limited integration due hosted APIs.

**Option B: modular self-hosted services.** Use separately containerized apps behind subdomains, with a separate shared platform database container and explicit data ownership and permissions. Third-party services may require their own database or supported APIs; validate each integration.

**Option C: fork Hylo.** Only after testing a core requirement that cannot be solved by integration. Forking implies maintaining Sails/GraphQL/React internals and upstream merges.

## Operational expectations

Backups, access logging, monitoring, TLS, email deliverability, disaster recovery, incident response, accessibility, mobile usability, and organizational admin succession all belong in launch acceptance testing.
