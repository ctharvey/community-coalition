# Decision log and open questions

This log distinguishes the project's **stated goals and preferences** from **proposed technical choices**. No partner organization's decisions are assumed.

| ID | Status | Subject | Current understanding | Next validation |
| --- | --- | --- | --- | --- |
| D-001 | Stated goal | Coalition purpose | Coordinate existing organizations and their events, rather than replace or control them | Obtain opt-in pilot participation |
| D-002 | Stated preference | Implementation stack | Favor Python, Java, PHP, JS/TS; avoid Drupal | Use in OSS selection |
| D-003 | Stated premise | Brookfield event finances | HOA's ordinary community events do not fundraise; avoid mixing partner funds | Confirm with board and insurer for each event |
| D-004 | Stated intent | School interface | PTO handles PfISD facility/permission relationship in any joint school-site event | Get PTO and district written permissions |
| D-005 | Stated intent | Hylo | Use Hylo as the foundation for community coordination and organizer identity, subject to integration validation | Pilot hosted Hylo; verify OIDC, group authorization, public visibility, branding and APIs |
| D-006 | Proposed | Public calendar | Standalone collector/public site rather than treating Hylo group feeds as public | Test real local sources |
| D-007 | Proposed | Ad-free signups | Pilot OpenSignup as independent service | Verify security, roles, multi-org isolation |
| D-008 | Proposed | Payments | Organization-owned Stripe Connect direct charges; no coalition custody or fee | Test with Hi.Events and identify legal operator |
| D-009 | Open | Legal structure | No nonprofit has been formed for this concept; initial coordination could be informal | Legal/operational decision after pilot |
| D-010 | Open | Hosting and governance | Who owns domain, deployment, admin access, backups, terms, insurance? | Establish before public launch |
| D-011 | Open | Licenses | Several candidates use AGPL/extra terms | Audit compatibility before any code incorporation |
| D-012 | Stated goal | Unified platform architecture | One shared brand across app subdomains, with separate app containers and a separate database container for shared platform data | Choose domain, operator, database, data boundaries and supported third-party integrations |

## Decisions to request from project participants

1. Which **two organizations** will participate in a voluntary pilot?
2. What domain and identity should the platform use, and who controls them?
3. Who can authorize publication on behalf of an organization?
4. Which data is owned by each app, and which supported interfaces should share it?
5. Who will operate the system, pay modest infrastructure/email costs, and respond to privacy or payment issues?

## Change practice

Append dated decision entries after a real decision is made. Record: authorizing person/organization, alternatives considered, rationale, effects on other organizations, and how to reverse it. Avoid rewriting unconfirmed proposals as past decisions.
