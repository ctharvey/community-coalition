# community-coalition data models

API owns organizations, identities, memberships, events, event_sources and event_audit.
Roles: ADMIN, EDITOR, APPROVER; platform administrators are separately provisioned identities.
Lifecycle: DRAFT, CONFIRMED, SUBMITTED, APPROVED, PUBLISHED, REJECTED, CANCELLED.
Edits return to DRAFT. Public DTOs contain event fields and public attribution only.
Offset timestamps retain an IANA time zone; all-day events also retain local dates.
Flyway SQL is canonical storage; Java records define DTOs; springdoc exports OpenAPI.
Frontend types are generated from a committed OpenAPI snapshot.
Mock uploads are decoded then discarded; digest/type provenance is persisted.

## Approved target model: organization presence and shared content

Status: owner-approved design on 2026-10-29; not an existing schema or API contract.
The current API foundation scopes sources, evidence, drafts and events to one organization.
Implementing the following requires backend schema/API changes and generated frontend contracts.

| Concept | Meaning and relationships |
|---------|---------------------------|
| Organization profile | Public presence that can exist unclaimed; school and PTO are separate, linked organizations. |
| Organization claim | Verification request and approval record; only approved claims grant explicit management roles. |
| Feed source | A canonical source identified by provider and URL/external identity, such as Facebook or iCalendar. |
| Source association | Many-to-many relationship between sources and organizations; does not grant access or endorsement. |
| Content association | Links an individual event, flyer or request to relevant organizations independently of its manager. |
| Calendar view | A selection of organizations whose published events are combined, deduplicated by stable event identity. |

- Profiles may receive reviewed content before being claimed. An unclaimed profile does not imply participation,
  consent, endorsement or an official organizational account.
- Claims require verification and approval, with auditable decisions, role grants and revocation. A user cannot
  self-grant administration by naming an organization, signing in with Facebook or attaching its feed URL.
  School and PTO claims/permissions remain separate.
- Attach supported feeds by link. Multiple organizations can reference one source; one organization can have
  multiple sources. Normalize provider identity so equivalent links do not create duplicate ingestion streams.
- Import shared source items once and preserve source/version provenance. A source association is a candidate
  classification context, not an instruction to attach every post to every associated organization.
  Each extracted item is reviewed for its own organization associations.
- Each draft/event has one managing organization for authorized editing, review and publication. Additional
  organization associations describe relevance, not ownership transfer or shared administration.
  Shared-source association never exposes another organization's private drafts, uploads, contacts or credentials.
- Preserve source attribution and distinguish community-associated material from material verified as officially
  published by the organization. Claims and source links alone do not make an event official.
- A combined school-plus-PTO calendar is a view over published event associations. Show one event once even when
  both organizations match; retain its organization labels, provenance and stable identity. No copied events,
  merged organizations, merged permissions or new calendar service are needed for this view.
- Existing human confirmation, approval and explicit publication remain required. AI never publishes directly;
  drafts stay private and pending edits preserve the last approved public version.
- A Facebook link does not grant Graph permissions or access to private content. Sign-in, organization claims,
  source association and provider read consent are separate processes; ingestion uses only supported access methods.

The API owns implementation and authorization. Frontend DTOs must continue to be generated from OpenAPI;
do not treat these conceptual names as already available tables, endpoints or TypeScript types.
