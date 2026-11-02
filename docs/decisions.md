# Decision log and open questions

This log distinguishes the project's **stated goals and preferences** from **proposed technical choices**. No partner organization's decisions are assumed.

| ID | Status | Subject | Current understanding | Next validation |
| --- | --- | --- | --- | --- |
| D-001 | Stated goal | Coalition purpose | Coordinate existing organizations and their events, rather than replace or control them | Obtain opt-in pilot participation |
| D-002 | Stated preference | Implementation stack | Favor Python, Java, PHP, JS/TS; avoid Drupal | Use in OSS selection |
| D-003 | Stated premise | Brookfield event finances | HOA's ordinary community events do not fundraise; avoid mixing partner funds | Confirm with board and insurer for each event |
| D-004 | Stated intent | School interface | PTO handles PfISD facility/permission relationship in any joint school-site event | Get PTO and district written permissions |
| D-005 | Superseded 2026-10-28 | Hylo | Custom application selected by project owner; pilot retained as historical research | See D-013 and architecture.md |
| D-006 | Proposed | Public calendar | Standalone collector/public site rather than treating Hylo group feeds as public | Test real local sources |
| D-007 | Proposed | Ad-free signups | Pilot OpenSignup as independent service | Verify security, roles, multi-org isolation |
| D-008 | Proposed | Payments | Organization-owned Stripe Connect direct charges; no coalition custody or fee | Test with Hi.Events and identify legal operator |
| D-009 | Open | Legal structure | No nonprofit has been formed for this concept; initial coordination could be informal | Legal/operational decision after pilot |
| D-010 | Open | Hosting and governance | Who owns domain, deployment, admin access, backups, terms, insurance? | Establish before public launch |
| D-011 | Open | Licenses | Several candidates use AGPL/extra terms | Audit compatibility before any code incorporation |
| D-012 | Stated goal | Unified platform architecture | One shared brand across app subdomains, with separate app containers and a separate database container for shared platform data | Choose domain, operator, database, data boundaries and supported third-party integrations |

## 2026-10-28 - Authorized application architecture

Authorizing person: project owner, October 28 implementation handoff.

- D-013 (Approved): Astro/React/TypeScript SSR, Java 21 Spring Boot, PostgreSQL, Flyway, REST,
  OpenAPI-generated TypeScript. Build a small application; do not fork Hylo.
- D-014 (Approved): coordination/prototype, frontend and API are three repositories under projects/Pfcc.
  Independent builds/deployments; API owns authoritative writes and migrations. No shared Java library,
  ingestion worker repository, deployment registry or database repository yet.
- D-015 (Milestone): Spring Boot 4.1.2 + springdoc 3.2.0; Astro 7.4.3 + Node adapter 11.1.9,
  React 19.3.1 + React adapter 6.0.6. Checked upstream metadata/peer ranges; no Yawn domain source copied.
- D-016 (Milestone): provision synthetic Basic accounts with CSRF only in local profile. Default profile
  denies organizer access. Evaluate Keycloak (self-hosting burden), managed OIDC (cost/provider dependency)
  and Spring Authorization Server (we would operate identity infrastructure). Prefer OIDC via Spring
  Security; defer provider selection. Server-side membership provisioning; names never grant administration.
- D-017 (Milestone): retain tested node-ical importer as a temporary operator tool. No Java rewrite until
  recurrence parity is proven. Future TypeScript collector stages through authenticated API, never publishes
  or writes database directly. See architecture.md.
- D-018 (Milestone): implementation repositories private pending original-code license. Gradle wrapper is
  upstream Apache-2.0 tooling. No source license selected on the owner's behalf.
- D-019 (Milestone): mock extraction only; standard processing intended for later Luna integration.
  Decode PNG/JPEG up to 2 MB / 12 megapixels; discard originals, retain private digest/type provenance.
  Dates remain missing until human correction. Extraction never confirms, submits, approves or publishes.

Reversal: review API contract/migration changes; replace ingestion and identity behind these boundaries.
The owner's subsequent instruction on 2026-10-28 authorizes adapting the prototype flyer extractor into Java.
D-020 (Implemented for review): Responses API adapter for gpt-6-luna, explicit standard processing only,
server-side credentials, private multi-event suggestions and explicit human date correction.
The prototype's year-guessing behavior is deliberately not ported. No provider request can publish or grant authority.
Live paid model verification remains outstanding; tests use a local fake and synthetic content.
No organization endorsement, financial custody or production deployment is authorized.

## 2026-10-28 - Facebook Page registration investigation

D-021 (Investigated; implementation not approved by this entry): test organizer-authorized Facebook Page
access through Facebook Login for Business instead of assuming arbitrary public feed access. Start by
validating the minimal read permissions and user-derived long-lived Page-token path with one test Page;
compare business-integration tokens where PTO business portfolios are available. Meta App Review,
Advanced Access, operator business verification and real Coalition organizer identity are launch gates.
Connecting a Page never grants administration over an existing Coalition organization. No Meta app,
account connection, scraping job or production deployment was created. See [the assessment](facebook-page-onboarding.md).

## Decisions to request from project participants

1. Which **two organizations** will participate in a voluntary pilot?
2. What domain and identity should the platform use, and who controls them?
3. Who can authorize publication on behalf of an organization?
4. Which data is owned by each app, and which supported interfaces should share it?
5. Who will operate the system, pay modest infrastructure/email costs, and respond to privacy or payment issues?

## Change practice

Append dated decision entries after a real decision is made. Record: authorizing person/organization, alternatives considered, rationale, effects on other organizations, and how to reverse it. Avoid rewriting unconfirmed proposals as past decisions.
