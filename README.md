# Community Coalition (working name)

An exploratory, open-source-first project for making it easier for existing Pflugerville-area organizations to coordinate events, share resources, and offer useful community tools.

**Status:** Discovery / planning. This repository is a research and implementation workspace, **not** an incorporated nonprofit, official partnership, public service, or authorization to represent a participating organization.

## Mission

Help independent neighborhood associations, school PTOs, MUDs, apartment communities, and local groups do more together while preserving each organization's authority, identity, data, and finances.

Initial stakeholders/use cases under exploration include Brookfield Estates HOA, the newly formed Wieland Elementary PTO, Northtown MUD, other PfISD-area schools, neighborhoods, and apartment communities. **No organization's participation or endorsement is assumed.**

## Four product goals

1. **Public community events calendar:** Aggregate approved public events from the systems organizations already use. Residents should not need an account to see events.
2. **Inter-organization coordination:** Support co-hosted events, discussions, offers/requests, volunteers, equipment, and coordination across independent organizations.
3. **Shared organizer knowledge:** Reusable checklists, vendor/resource directory, event templates, lessons learned, and permission/insurance guidance.
4. **Affordable, ad-free community tools:** Volunteer/supply signup sheets, event registration, and potentially organization-owned payments, without an advertising business model.

## Guiding principles

- **Organizations remain independent.** Listing an event or collaborating on one does not imply sponsorship, endorsement, or transfer of legal authority.
- **Publish once, aggregate responsibly.** Partners should not be required to migrate their calendar or join a new platform just to have public events listed.
- **Public by intention, private by default.** Do not expose school/student data, private volunteer records, internal event planning, or unapproved events.
- **Finances remain separate.** If payments are added, each approved organization uses its own Stripe connected account and bank payout destination; the coalition does not collect or redistribute another group's funds.
- **Reuse OSS before building.** Preferences: JavaScript/TypeScript, Python, PHP, or Java; no Drupal dependency.
- **Minimize accounts and ads.** Public browsing and basic signups should not require account creation or ad-based tracking.

## Current proposed composition (not yet selected)

| Need | Candidate | Present assessment |
| --- | --- | --- |
| Coalition collaboration | [Hylo](https://github.com/Hylozoic/hylo) | Strong groups/cross-posting/events/requests; inbound calendar aggregation is missing |
| Public events aggregation | [Community Calendar](https://github.com/judell/community-calendar) | Good source-ingestion/curation starting point |
| iCalendar parsing | [node-ical](https://github.com/jens-maus/node-ical) | Useful for a TypeScript-based importer |
| Simple ad-free signups | [OpenSignup](https://github.com/richshaw/OpenSignup) | Very promising direct fit; young project |
| More advanced volunteer shifts | [Ephios](https://github.com/ephios-dev/ephios) | Mature feature set; evaluate as separate service |
| Event ticketing / organizer-owned payment | [Hi.Events](https://github.com/HiEventsDev/Hi.Events) + [Stripe Connect](https://stripe.com/connect) | Existing OSS Stripe integration, licenses and account separation need verification |
| Richer documentation | [BookStack](https://www.bookstackapp.com/) | Defer until native Hylo resources/pages are insufficient |

## Repository guide

- [Project scope and success criteria](docs/vision-and-scope.md)
- [Current findings and unknowns](docs/current-state.md)
- [Proposed architecture](docs/architecture.md)
- [Open-source options and build-vs-borrow](docs/oss-evaluation.md)
- [Legal, governance, privacy, and safety considerations](docs/governance-and-risk.md)
- [Example event workflows](docs/use-cases.md)
- [Prioritized research and implementation plan](docs/roadmap.md)
- [Decisions and open questions](docs/decisions.md)
- [Facebook Page OAuth and PTO onboarding assessment](docs/facebook-page-onboarding.md)

## What this is not (yet)

- An approved PfISD partnership or a representative of any school district, HOA, or MUD.
- A fundraising entity, merchant of record, or shared bank account.
- A production-ready platform or a commitment by any organization to use specific software.

## Contributions

Research notes should distinguish **verified fact**, **inference**, **proposal**, and **open question**, link original sources, and include dates for time-sensitive facts. Avoid committing contact information, student records, credentials, or private HOA/PTO documents without explicit authority.

This repository currently contains planning documentation only. Software licensing and long-term operating governance have **not yet been selected**.
