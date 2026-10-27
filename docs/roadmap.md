# Roadmap and research queue

**Status:** Implementation priorities agreed by the project owner. These are priorities, not commitments by participating organizations or deployment schedules.

The calendar and submission workflow is Priority 1 and can be developed before other organizations formally join. Organizer authorization, privacy, and an appropriate operator remain gates for real event publication. Priorities 2-4 follow below; payment implementation is deferred until event and volunteer workflows are useful.

## Foundations — required for real use

- [ ] Confirm project operator, provisional moderation/decision authority, scope, and any public-facing disclaimers.
- [ ] Design a shared brand and app subdomains around Hylo, with separately containerized apps and a separate shared platform database; define data ownership, access controls, integration boundaries, backups and deployment.
- [ ] Validate self-hosted Hylo OIDC, API client provisioning and group-role authorization for organizer workflows before selecting an authentication integration; see [Hylo investigation](hylo-auth-integration-2026-10-26.md).
- [ ] Confirm willing *pilot participants* and each organization's official contact/authorization process.
- [ ] Compile actual public calendar sources for Brookfield, PfISD/Wieland, Northtown MUD, and one apartment or additional neighborhood; note whether feed, webpage, or manual input.
- [ ] Test Hylo account-free event visibility and public/private controls; verify group calendar feeds do not expose internal events.
- [ ] Document HOA/PTO/PfISD event permissions before committing to a school-venue pilot.
- [ ] Agree on minimal personal-data collection and organization administrator separation.

**Gate:** Appropriate operator, organization authorization, and privacy controls are established before real events are published. Building the calendar does not require other organizations to join first.

## Priority 1 — Calendar and event submission

- [ ] Accept authorized flyer submissions and extract event fields with GPT-6 Luna using standard processing by default; require organizer review and correction.
- [ ] Implement separate confirmation, submission, approval and publication transitions, including organization access and cancellation handling.
- [ ] Provide an account-free public calendar, automatic imports from verified public calendars, and distribution through calendar feeds and supported social integrations.
- [ ] Verify official Facebook event-creation capabilities before designing any integration; do not assume unrestricted third-party access.
- [ ] Compare installing Community Calendar directly versus the existing minimal node-ical service.
- [ ] Implement or demonstrate source registry, allowlisted feed fetch, recurring events, dedupe, attribution, cancellation propagation, and stale-feed alert.
- [ ] Add curator review for events without stable public feeds.
- [ ] Confirm public mobile usability, accessibility, and no-login discoverability.
- [ ] Establish update, backup, and incident-handling procedures.

**Exit:** Real approved events from multiple independent sources remain accurate after changes.

## Priority 2 — Replace volunteer signup services

- [ ] Deploy/evaluate OpenSignup in a non-production environment; inspect its source and license.
- [ ] Test egg-hunt setup and cleanup, candy and supply donations, classroom or PTO volunteers, food contributions, reminders and organizer notifications.
- [ ] Verify volunteers can sign up without accounts, advertisements or installing an app, with organization-controlled information.
- [ ] Audit account/organization boundaries and admin succession; determine whether separate instances or multi-tenant improvements are needed.
- [ ] Compare Ephios if simple slots cannot cover real needs.

**Exit:** Volunteers can safely claim slots without ads; organizers see only their own rosters.

## Priority 3 — Test Hylo with real organizers

- [ ] Build and validate a local self-hosted Hylo pilot; later test with two independent organizer groups, with their agreement.
- [ ] Test event sharing, equipment and volunteer requests, joint activities, private organizer discussions, and reusable resources.
- [ ] Validate permissions and co-host approval; don't conflate cross-posting with legal endorsement.
- [ ] Validate self-hosting operations, integration and support; use a hosted comparison only if it helps resolve a specific question.

## Priority 4 — Payments

- [ ] Defer implementation until the event and volunteer workflows are useful; ensure each organization retains control of its own financial account.
- [ ] Inspect/test Hi.Events multi-organizer role isolation, Stripe Connect onboarding, and direct-charge account routing.
- [ ] Confirm each participating organization has authority, identity, and financial infrastructure to accept payment.
- [ ] Prototype a **single-organization checkout** with Stripe-hosted onboarding and verified webhook handling.
- [ ] Evaluate fees on realistic small-ticket PTO transactions; account for processing, hosting, and refunds.
- [ ] Publish separate seller/refund/tax responsibilities; do not pool money or issue coalition donation receipts.

## Later — Advanced capabilities

- [ ] Structured equipment lending/pledges and quantity tracking if requests/offers prove insufficient.
- [ ] Formal wiki with BookStack if native Hylo resource pages become limiting.
- [ ] Advanced volunteer shifts and hours with Ephios if needed.
- [ ] Vendor/partner directory with verification and expiry.
- [ ] Consider an independent nonprofit/legal structure only if operational needs justify it.

## Definition of done for research

Every recommendation should record (1) original source and date, (2) license, (3) feature actually verified, (4) unverified assumptions, (5) privacy/security concerns, (6) operating complexity, and (7) a concrete pilot acceptance test.
