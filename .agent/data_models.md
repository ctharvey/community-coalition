# community-coalition data models

API owns organizations, identities, memberships, events, event_sources and event_audit.
Roles: ADMIN, EDITOR, APPROVER; platform administrators are separately provisioned identities.
Lifecycle: DRAFT, CONFIRMED, SUBMITTED, APPROVED, PUBLISHED, REJECTED, CANCELLED.
Edits return to DRAFT. Public DTOs contain event fields and public attribution only.
Offset timestamps retain an IANA time zone; all-day events also retain local dates.
Flyway SQL is canonical storage; Java records define DTOs; springdoc exports OpenAPI.
Frontend types are generated from a committed OpenAPI snapshot.
Mock uploads are decoded then discarded; digest/type provenance is persisted.
