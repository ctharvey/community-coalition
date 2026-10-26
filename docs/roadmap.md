# Roadmap and research queue

**Status:** Proposed priorities. Stages are validation gates, **not** schedules or commitments.

## P0 — Establish trustworthy foundations

- [ ] Confirm project operator, provisional moderation/decision authority, scope, and any public-facing disclaimers.
- [ ] Confirm willing *pilot participants* and each organization's official contact/authorization process.
- [ ] Compile actual public calendar sources for Brookfield, PfISD/Wieland, Northtown MUD, and one apartment or additional neighborhood; note whether feed, webpage, or manual input.
- [ ] Test Hylo account-free event visibility and public/private controls; verify group calendar feeds do not expose internal events.
- [ ] Document HOA/PTO/PfISD event permissions before committing to a school-venue pilot.
- [ ] Agree on minimal personal-data collection and organization administrator separation.

**Exit:** At least two willing organizations and one reliable, privacy-safe public event flow.

## P1 — Public calendar proof of concept

- [ ] Compare installing Community Calendar directly versus a minimal TypeScript service using node-ical.
- [ ] Implement or demonstrate source registry, allowlisted feed fetch, recurring events, dedupe, attribution, cancellation propagation, and stale-feed alert.
- [ ] Add curator review for events without stable public feeds.
- [ ] Confirm public mobile usability, accessibility, and no-login discoverability.
- [ ] Establish update, backup, and incident-handling procedures.

**Exit:** Real approved events from multiple independent sources remain accurate after changes.

## P1 — Ad-free signup proof of concept

- [ ] Deploy/evaluate OpenSignup in a non-production environment; inspect its source and license.
- [ ] Test actual HOA/PTO volunteer slots, reminder emails, deletion/export, and no-account participant flow.
- [ ] Audit account/organization boundaries and admin succession; determine whether separate instances or multi-tenant improvements are needed.
- [ ] Compare Ephios if simple slots cannot cover real needs.

**Exit:** Volunteers can safely claim slots without ads; organizers see only their own rosters.

## P1/P2 — Collaboration hub

- [ ] Pilot hosted Hylo with two independent organizer groups.
- [ ] Configure event cross-posting, requests, offers, resource posts/pages, and coalition agreements.
- [ ] Validate permissions and co-host approval; don't conflate cross-posting with legal endorsement.
- [ ] Decide hosted Hylo, self-host Hylo, or lighter hub based on usage and integration constraints.

## P2 — Payments, registration, and optional finance tools

- [ ] Inspect/test Hi.Events multi-organizer role isolation, Stripe Connect onboarding, and direct-charge account routing.
- [ ] Confirm each participating organization has authority, identity, and financial infrastructure to accept payment.
- [ ] Prototype a **single-organization checkout** with Stripe-hosted onboarding and verified webhook handling.
- [ ] Evaluate fees on realistic small-ticket PTO transactions; account for processing, hosting, and refunds.
- [ ] Publish separate seller/refund/tax responsibilities; do not pool money or issue coalition donation receipts.

## P3 — Advanced capabilities

- [ ] Structured equipment lending/pledges and quantity tracking if requests/offers prove insufficient.
- [ ] Formal wiki with BookStack if native Hylo resource pages become limiting.
- [ ] Advanced volunteer shifts and hours with Ephios if needed.
- [ ] Vendor/partner directory with verification and expiry.
- [ ] Consider an independent nonprofit/legal structure only if operational needs justify it.

## Definition of done for research

Every recommendation should record (1) original source and date, (2) license, (3) feature actually verified, (4) unverified assumptions, (5) privacy/security concerns, (6) operating complexity, and (7) a concrete pilot acceptance test.
