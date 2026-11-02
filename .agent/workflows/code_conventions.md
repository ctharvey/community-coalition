# community-coalition conventions

Four-space indentation, 120-character lines, Java imports, no TypeScript any.
Separate controllers, services, repositories and DTOs. Backend authorization owns writes.
Never edit applied migrations or publish fixtures outside local development. Never commit secrets or uploads.
API: ./gradlew check bootJar (Docker required for PostgreSQL Testcontainers).
Frontend: npm ci, npm run check, npm run lint, npm test, npm run build.
Prototype: npm ci, npm test, npm run build in apps/calendar.
Default checkouts stay on main; feat/calendar-foundation uses .worktrees/calendar-foundation.
Stage explicit paths, commit conventionally and use draft PRs. No production deploy or merge without review.
