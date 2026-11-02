# community-coalition architecture

Astro/React/TypeScript SSR and Java 21 Spring Boot REST applications build independently.
The API alone writes PostgreSQL; Flyway migrations live with the API. No shared library or worker repository.
Coordination docs and the preserved node-ical prototype live in community-coalition.
Public reads return published events only. Organizer writes enforce database memberships and audit changes.
Default private access is denied. Keycloak OIDC is integrated locally; synthetic memberships require the local profile.
Frontend API_BASE_URL is server-only. API DB_URL, DB_USERNAME, DB_PASSWORD and LOCAL_DEMO_PASSWORD use environment configuration.
An optional Java Luna adapter now supports configured extraction; tests use synthetic local provider responses.
Live Graph fetching remains disabled; the manual Apify pilot retains public-source material privately for review.
No production deployment or organization endorsement. Dates require explicit human correction.
See root README and coordination docs/architecture.md for setup and decisions.

## Approved direction: profiles, sources and combined calendars

Organization presence is independent of verified management. Schools and PTOs have separate, linked profiles,
which may remain unclaimed while reviewed events, flyers and requests are associated with them.
Claiming requires verification and approval; Facebook sign-in or selecting an organization name grants no authority.
Feed URLs identify reusable sources, with many-to-many organization associations. Import a shared source once;
assign each item to its relevant organizations rather than inheriting every source association automatically.
Combined calendars select multiple organizations and show a shared event once, without copying events or merging roles.
One managing organization retains draft/edit/approval authority; association and calendar inclusion confer no access.
Source attribution and official-versus-related labeling remain explicit; attaching a URL grants no provider access.
The detailed approved model and implementation boundary are in [data_models.md](data_models.md).
These profile/claim/shared-source/calendar changes are planned, not implemented by this documentation update.
