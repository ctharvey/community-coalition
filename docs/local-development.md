# Local calendar development

The three checkouts live under C:\Users\thron\IdeaProjects\projects\Pfcc. Canonical checkouts stay on main;
review work lives in each repository's .worktrees/calendar-foundation on feat/calendar-foundation.
Start PostgreSQL/API from the API README, then Astro from the frontend README. No production deploy is configured.

## Optional local reverse proxy

A local Caddy instance can route one origin to independently running apps:

```caddyfile
http://localhost:8088 {
    bind 127.0.0.1
    handle /api/* {
        reverse_proxy 127.0.0.1:8081
    }
    handle {
        reverse_proxy 127.0.0.1:4321
    }
}
```

This is a development example, not a production hosting decision. A production configuration must select a real
operator/domain, use HTTPS, keep PostgreSQL private, explicitly allowlist environment variables and secure OIDC.
Do not forward unrelated credentials or expose local Basic/demo mode publicly.

## Backup and restore practice

Before real data: establish encrypted off-host backups, retention, access controls and a scheduled restore drill.
Use pg_dump custom format from the matching PostgreSQL version, then pg_restore --no-owner --no-privileges into
a separately created empty database. Never overwrite the working database to test restore.
Verify Flyway checksums, event/source/audit counts and organization isolation against the restored database.
A successful local dump/restore alone is not an operational backup strategy. Keep backup files out of Git.

## Review boundaries

The existing feat/calendar-poc and draft PR #2 are preserved. The coordination foundation branch starts from
that prototype to retain working importer code. Review its new commits relative to feat/calendar-poc; do not
merge the old Hylo architecture as the selected direction. Frontend and API have independent draft PRs.
