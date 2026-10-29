# Facebook Page onboarding assessment

Date: 2026-10-28. Status: investigated; implementation and Meta approval are pending.

## Finding and recommendation

A cooperating PTO can authorize access to its Facebook Page through Meta OAuth. The initial integration
should test Facebook Login for Business with a User-token configuration, exchange the authorization code
on the Java backend, and derive a long-lived Page token. Start with bounded polling of Page-authored posts.
This tests the documented user-derived Page-token path before requiring every PTO to create a Meta business portfolio.

Meta also offers Business Integration System User tokens for unattended business integrations. That path
requires a business portfolio for both the platform operator and the client organization, with the operator
controlling its separate portfolio. Evaluate it for organizations already set up that way; do not make it
the default PTO onboarding requirement without a pilot. Meta recommends the business-integration token for
unattended business access. Confirm that our selected configuration and approved use case permit the proposed
user-derived Page-token collector before selecting it for production; token lifetime alone does not establish that.
Neither token type means access can never be revoked.

This is a Page integration, not Group ingestion. No scraping or access-control circumvention is needed for
the proposed pilot. Meta approval for our exact event-syndication and AI-processing use case is not established.

## What the PTO does

1. Sign into Coalition and choose an organization they already administer. An invite/verified organization
   onboarding path must exist first. A new applicant may request a new organization, but cannot claim an
   existing one by name or by completing Facebook login.
2. Select Connect Facebook Page. Coalition explains that it reads Page posts and flyers to prepare private drafts.
3. Sign into Facebook on Meta's site and grant the configured permissions/assets.
4. Return to Coalition and select the intended Page from the Pages actually returned by Meta.
5. Review the Page/organization association and a bounded import preview, then enable collection.
6. Subsequently review prepared components, corrections and approval requests. Reconnect when access is invalidated.

The person needs appropriate access to the actual Page. Being a follower, a PTO member, or a Facebook Group
administrator does not establish Page authorization. If no eligible Page is returned, show that condition;
do not silently collect another Page or fall back to a logged-in scraper.

## OAuth round trip

```mermaid
sequenceDiagram
    actor Admin as Authorized PTO admin
    participant UI as Astro / React
    participant API as Spring API
    participant Meta as Meta OAuth / Graph
    participant DB as PostgreSQL
    Admin->>UI: Connect Facebook Page
    UI->>API: POST authorization start (session + CSRF)
    API->>API: Check organization ADMIN; create expiring state
    API-->>Admin: Redirect to Meta authorization dialog
    Admin->>Meta: Sign in and grant selected access
    Meta-->>API: Registered callback with code and state
    API->>API: Validate state, session, expiry and current organization role
    API->>Meta: Server-side code exchange; validate token/app and granted access
    API->>Meta: Long-lived user-token exchange; list Pages and derive Page tokens
    API->>DB: Store short-lived pending selection; tokens encrypted
    API-->>UI: Safe Page candidates and pending connection ID
    Admin->>API: Confirm selected Page and organization
    API->>API: Recheck role and candidate eligibility
    API->>DB: Persist Page binding, encrypted token and audit
    API-->>UI: Connected; collection disabled until explicit enable
```

- Use authorization-code flow (`response_type=code`), configured Meta `config_id`, and an exactly registered
  callback URI. Do not put access tokens in browser fragments or frontend storage.
- Use Spring Security OAuth2 Client authorization request/state handling and code exchange, with the small
  Meta-specific configuration/token exchange adapters. Do not implement custom JWT/authentication machinery.
- Bind state to a server-side session, actor, organization, intended action and fixed callback; make it
  unpredictable, short-lived and single-use. Reject cross-session, replayed, expired and mismatched callbacks.
- Facebook authorization connects a source to the existing Coalition principal. Do not replace that principal
  with the Facebook identity or derive Coalition organization roles from Facebook profile/Page names.
- Validate token application ID, validity, granted permissions, expiry and eligible Page access on the backend.
  Do not trust a Page ID or token supplied by the browser. Paginate the returned Page list.
- Spring's current client support enables PKCE in some configurations. Verify compatibility with the selected
  Meta configuration and provider adapter in the pilot; do not invent provider support or disable protections globally.

## Minimum permissions

| Permission | Purpose | Initial scope |
| --- | --- | --- |
| `pages_show_list` | List managed Pages and establish eligible candidates | Required |
| `pages_read_engagement` | Read content authored by the connected Page, including posts/photos | Required |
| `pages_manage_metadata` | Subscribe to Page feed webhooks | Defer until webhook phase |
| `public_profile` | Facebook Login baseline; current Business Login guide requires Advanced Access before external users | Include in app-review validation |

Do not request posting, messaging, ads, follower-data retrieval or visitor/comment-reading permissions for
the first release. The read permission covers more data than we need; restrict the Graph fields actually requested.
The broad Posts guide lists permissions for its combined create/read/update/delete examples; it is not a reason
to request all of those write permissions for a read-only collector. Confirm the minimal set with a real test Page.

The official webhook guide requires `pages_manage_metadata` plus `pages_show_list` for feed subscriptions,
and a Page token obtained from a person able to perform CREATE_CONTENT, MANAGE or MODERATE tasks.
Webhooks notify us of changes; the backend still fetches and validates the authoritative post snapshot.

## Token lifetime and disconnects

Meta documents exchanging a short-lived user token for a long-lived user token (generally about 60 days),
then using the latter to obtain a long-lived Page token. Its current guide says those Page tokens have no
scheduled expiration, but they remain subject to invalidation. Do not promise permanent access or assume
Meta returns an ordinary OAuth refresh token. Track returned expiry/validity metadata and implement Reconnect.

Store Page tokens encrypted at rest with a managed key or externally supplied encryption key, not a key in
the same database. Separate tokens by connection/organization; record granting actor, Page ID, scopes, token
type, timestamps, status and an encryption-key version. Persist temporary user tokens only as long as needed
for the flow; remove pending credentials after completion/expiry. Store no secrets in audit snapshots.

No token, app secret or authorization code goes into React props, URLs we generate for the frontend, analytics,
exception messages, request logs or API responses. Redact the callback query and token-exchange/debug requests.
Use no-store responses and a clean post-callback redirect. Meta's identity check may require a server-only app
token; that is not a credential to expose to the organizer.

Disconnect stops collection and removes stored credentials. Account for a person removing the integration
inside Facebook: deauthorization and data-deletion callbacks must validate Meta's signed payloads and have
explicit retention/deletion behavior. Do not automatically publish a cancellation merely because a post is
unavailable: token failure, removal, access restriction and actual event cancellation are different conditions.

## Work in the existing applications

| Area | Work needed |
| --- | --- |
| Organizer identity | Replace local-only Basic accounts for external organizers with the selected established identity/session solution; retain server-provisioned memberships and organization verification |
| API OAuth client | Add the Spring Boot OAuth2 client starter, Meta client registration/resolver, bounded pending connection state, callback handler, token validation/exchange and safe Page selection |
| PostgreSQL / Flyway | Add organization-scoped source connections, encrypted credentials, pending authorization metadata, imported post versions/cursors and connection audit records |
| Astro / React | Connect/Page selection/import-preview controls; connected, permission denied, no eligible Pages, reconnect, paused and disconnected states; generated OpenAPI DTOs |
| Collection | A bounded scheduled job in the API initially; no new worker repository, queue broker or service required for the pilot |
| Draft ingestion | Fetch Page-authored post text and permitted flyer images; preserve post/Page IDs, permalinks, timestamps and content hashes; deduplicate before Luna; save private typed components |
| Operations / review | Meta app setup, approved HTTPS callback/staging host, privacy/deletion pages, operator verification, review screencasts, connection health and budget limits |

Current code evidence: API `SecurityConfig.java` only allows organizer authentication in the local profile;
`OrganizationAccess.java` already enforces memberships. `build.gradle` has no OAuth2 client dependency.
`FlyerExtractionService.java` currently accepts one uploaded PNG/JPEG and a source URL, while
`ComponentDraftService.save` expects a human actor with EDITOR authority. These are reusable foundations,
but they are not a ready-made unattended Facebook collector.

Use `oauth2Client` connection semantics to preserve the existing signed-in organizer; do not casually enable
`oauth2Login` as an alternate path that overwrites their identity. Validate the selected Spring version's extension
points and Meta token exchange in a fake-provider test before connecting a real account. Production callbacks
should route to the backend through the reverse proxy; the development credential-forwarding Astro relay is
not a production authorization architecture.

The collector needs narrowly scoped source-ingestion authority, not an impersonated demo-editor or blanket
platform-admin token. Every run must enforce the active organization/source grant, with revocation stopping
future writes. It may create drafts only; it cannot confirm, approve or publish. Audit the connection and granting
actor. A source grant must not grant authority over another organization or the event publication API.

Reuse the typed extraction schema and upload decode/size/dimension checks. Extend the extraction input to
handle untrusted post text and supported image attachments; text-only posts must not be lost. Confirm the
image fields and resolution available under the granted permissions in the pilot. Validate image URLs against
approved Meta hosts, redirects, MIME and size before fetching; do not fetch arbitrary links found in post text.

Keep a server-verified Page ID binding; propose one active organization owner per Page initially, with explicit
review for shared/transfer cases. Connecting the same Page from another organization cannot silently take it over.
Require explicit collection enablement/backfill bounds and application-enforced AI/request budgets. A duplicate
post/image must not trigger another paid extraction. Updates produce reviewable revisions; they do not amend
approved/public content automatically. Cross-post grouping remains a separate pending feature.

## Meta setup and launch gates

Verified in Meta's current documentation:
- Use a compatible app/use case and Facebook Login for Business configuration specifying assets/token type/permissions.
- Serving organizations outside the app's own roles requires Advanced Access through App Review.
- Meta's permissions reference requires business verification for apps requesting Advanced Access.
- Current Business Login guidance also requires Advanced Access to `public_profile` before external users go live.
- Review evidence for our read permissions includes the full login, Page connection and display of retrieved Page content.
- Review/ongoing data-handling obligations apply; supply the requested privacy, deletion and app-review materials.

Our exact product use case must be presented honestly: organizer-authorized event syndication with OpenAI/Luna
processing, human correction/approval, and intended public calendar publication. Permission to read a Page is
not proof that Meta has approved all downstream AI processing or republication. Confirm those conditions during
review; do not describe an analytics-only product to obtain access for a different purpose.

The coordination repository currently says no nonprofit has been formed (D-009). Identify the actual platform
operator/app owner and its business-verification eligibility before assuming external PTO onboarding can launch.
The owner's verification is separate from requiring every PTO to have a portfolio for the optional system-user flow.
No verification application, app registration, hosting exposure or account connection was performed here.

## Smallest proof and acceptance tests

First use a test Page controlled by an app-role tester, with an approved development callback. Prove the
authorization-code flow, minimal permission set, managed-Page list, Page token derivation, and retrieval of both
post text and a flyer photo. Then prove a revoked connection stops collection and shows Reconnect. The test
does not establish eligibility for all outside organizations or substitute for Meta App Review.

Automated fake-Meta tests should cover state/session/organization mismatch, callback replay/expiry, cancelled
consent, missing permissions, wrong app token, paginated Page selection, forged Page IDs, revocation during
callback, duplicate bindings, encrypted credential storage, redacted logs, disconnects, throttling, job isolation,
changed-post deduplication, bounded backfills/AI budgets, no secret-bearing DTOs, and no publication paths.
If webhooks are added, test challenge validation, signatures, duplicate/out-of-order delivery and deferred processing.

Development work is several focused pieces beyond an OAuth button. The external critical path is app ownership,
verification and Meta approval; there is no defensible approval-time guarantee from this investigation.
The next engineering milestone should be identity/session foundation plus one test-Page connection and bounded
private ingestion, followed by an outside-PTO pilot only after approval. No production deployment is authorized.

## Evidence and remaining decisions

Official sources read on 2026-10-28 (canonical Meta documentation was readable in the browser; the search/fetch
connector returned 429s for the older URLs):

- [Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)
  (page showed updated Oct 15, 2026): configurations, token types, portfolio requirements, Advanced Access.
- [Permissions reference](https://developers.facebook.com/documentation/development/permissions):
  exact scope usage, business verification and review evidence.
- [Manual login flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow):
  state, callback/code exchange, token validation, deauthorization and deletion callbacks.
- [Long-lived tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived):
  long-lived user/Page token acquisition and invalidation caveats.
- [Pages API](https://developers.facebook.com/documentation/pages-api),
  [Posts](https://developers.facebook.com/documentation/pages-api/posts), and
  [Page webhooks](https://developers.facebook.com/documentation/pages-api/webhooks-for-pages).
- [Spring Security authorization grants](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/authorization-grants.html)
  and [OAuth2 client interfaces](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/core.html).

Open decisions: platform/Meta app owner eligible for verification; Coalition identity provider; participating
Page/admin; approved callback hostname; privacy/retention and AI-processing disclosures; collection/backfill/AI
budget. Proposed implementation details above are recommendations, not completed work or guaranteed Meta approval.
