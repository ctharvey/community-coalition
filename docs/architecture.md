# Architecture options and integration boundaries

**Status:** Proposal; no platform selected or deployed.

## Recommended conceptual split

```text
Public organization calendars / approved submissions
        -> source collector & curator review
        -> normalized approved public event catalogue
        -> public website (no account required)
                    |
                    +---- original organization/event link
                    +---- organizer collaboration links (when public)

Independent organizations -> coalition collaboration hub (Hylo candidate)
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

**Option B: modular self-hosted services.** Self-host collector/site and selected OSS signup/ticketing systems, preserving separate DBs and permissions; link services via APIs/webhooks/deep links.

**Option C: fork Hylo.** Only after testing a core requirement that cannot be solved by integration. Forking implies maintaining Sails/GraphQL/React internals and upstream merges.

## Operational expectations

Backups, access logging, monitoring, TLS, email deliverability, disaster recovery, incident response, accessibility, mobile usability, and organizational admin succession all belong in launch acceptance testing.
