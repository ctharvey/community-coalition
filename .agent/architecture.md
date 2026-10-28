# community-coalition architecture

Astro/React/TypeScript SSR and Java 21 Spring Boot REST applications build independently.
The API alone writes PostgreSQL; Flyway migrations live with the API. No shared library or worker repository.
Coordination docs and the preserved node-ical prototype live in community-coalition.
Public reads return published events only. Organizer writes enforce database memberships and audit changes.
Default private access is denied. Local synthetic accounts require the local profile; OIDC is deferred.
Frontend API_BASE_URL is server-only. API DB_URL, DB_USERNAME, DB_PASSWORD and LOCAL_DEMO_PASSWORD use environment configuration.
No live AI, Facebook fetching, production deployment or real organization data.
See root README and coordination docs/architecture.md for setup and decisions.
