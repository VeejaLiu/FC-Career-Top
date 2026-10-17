# Cloudflare deployment

[Documentation](README.md) · [Development](DEVELOPMENT.md) · [Database](DATABASE.md)

The project targets **Cloudflare Workers Free** with D1 and SQLite-backed Durable
Objects. The dashboard and website use static assets; the API keeps realtime WebSocket
notifications. Email verification and delivery are disabled.

| Application | Domain | Build output |
| --- | --- | --- |
| Website | `www.fccareer.top` | `apps/website/out` |
| Dashboard | `app.fccareer.top` | `apps/frontend/dist` |
| Admin | `admin.fccareer.top` | `apps/admin/dist` |
| API / WebSocket | `api.fccareer.top` | Worker bundle, WebSocket at `/ws` |

## First deployment

Install the pinned Node/pnpm versions and locked dependencies. From the repository root:

```sh
pnpm --filter @fc-career-top/backend exec wrangler login
pnpm --filter @fc-career-top/backend exec wrangler d1 create fc-career-top
```

Set the returned `database_id` in `apps/backend/wrangler.jsonc`. Keep the target
account on Workers Free. The backend's `new_sqlite_classes` migration uses the
Durable Object storage type supported on Free.

Set a random JWT signing secret of at least 32 characters using the interactive prompt:

```sh
pnpm --filter @fc-career-top/backend exec wrangler secret put SECRET_JWT
pnpm db:migrate:remote
pnpm build
pnpm deploy:backend
pnpm deploy:frontend
pnpm deploy:website
```

For an existing deployment, reuse its database and secret. Apply only pending
migrations and deploy the affected apps. Do not create a new database every time.
Never commit `.dev.vars`, OAuth credentials, or production secrets.

## Domain and URL configuration

The Wrangler files define a Worker route for each host (`hostname/*`). The three
existing DNS records are proxied through Cloudflare; requests are served by the
Workers without contacting the old origin. Keep those records proxied. A fresh
installation must add proxied DNS records for its hosts, or use Workers custom
domains instead. The zone must belong to the selected account.
For another domain, update the three Wrangler route lists, backend `ALLOWED_ORIGINS`,
frontend public URLs, website `NEXT_PUBLIC_BACKEND_URL`, and Go to App link.

Production URLs are already in the app `.env.production` files. For sitemap generation,
canonical URLs, structured data, sitemap and robots files use `SITE_URL`, then
`NEXT_PUBLIC_SITE_URL`, then `https://www.fccareer.top`. Next.js writes the sitemap
and robots files into `out` during the build. Both sites require a rebuild after
changing public environment variables.
No reverse proxy or permanently running Node server is needed.

The apex host is handled separately by `apps/website/wrangler.redirects.jsonc`.
It redirects `fccareer.top/*` to `https://www.fccareer.top` with HTTP 301, preserving
paths and query strings. Keep the apex DNS record proxied, then deploy this
separate redirect Worker with `pnpm deploy:website:redirects`. It does not put
the static website's ordinary traffic through Worker code. If changing domains,
also update that route and `CANONICAL_ORIGIN` to match the website's canonical URL.
Website-only SEO changes require `pnpm build:website`, `pnpm deploy:website`, and
the redirect deployment when adding or changing the apex redirect.

## Admin deployment

The console uses `fc-career-top-admin` at `https://admin.fccareer.top` and the
`https://fc-career-top-admin.veejaliu.workers.dev` fallback. Its Worker forwards
only management routes through the API service binding. Requests and HttpOnly
cookies stay on the Admin origin. `ADMIN_ALLOWED_ORIGINS` permits the two exact
Admin origins; customer origins are not allowed to mutate management data.

Administrators have independent username/password accounts and server-side sessions.
For a fresh database, apply migrations and provision with `pnpm admin:create --username admin --remote`.
The command generates a random password in a private file; there is no public sign-up
or customer account promotion. Never commit passwords, session cookies or backups.

To upgrade the initial mixed-account deployment, back up D1 and apply **only 0006**,
then deploy the API and verify the preserved administrator username/password.
Apply **0007 only after this check** to remove obsolete customer-side administrator
identities and the role column. Build and deploy Admin afterward. The cleanup
migration aborts if a mapped legacy identity owns business data. Keep existing
customer data and historical audit events. See the [Admin guide](../apps/admin/README.md).

## Verify

Check the website, dashboard, and `https://api.fccareer.top/api/health_check` (`ok`).
Register with an email and password; sign in with email/password, select FC 24/25, and copy the Lua script
from Get Started. Upload a snapshot from Live Editor and confirm the list, growth
chart, and realtime notification when a rating changes.

## Free-plan limits

Free hosting has quotas: ordinary Worker requests have a short CPU limit; password
hashing and data processing run in the Durable Object. Hibernation heartbeat replies
reduce active connection duration. Bulk uploads are capped at 200 players / 1 MB and
use a few batched D1 queries rather than one call per player.

D1 Free permits 500 MB per database, 5 million rows read/day and 100,000 rows written/day.
Worker and Durable Object quotas also apply. On Free, exceeding limits can stop service
until quotas reset; do not upgrade to a paid plan to bypass them if the budget is zero.
See [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), and
[Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/).

## Google sign-in

Google Identity Services uses the public `GOOGLE_CLIENT_ID` in the API Worker
configuration. The dashboard retrieves it from `/api/v1/user/google/challenge`;
no client secret is used or shipped to the browser. The Web application client
must authorize `https://app.fccareer.top`, `http://localhost`, and
`http://localhost:3000`. This JavaScript callback flow needs no redirect URI.

Configure Google Auth Platform with the `fccareer.top` authorized domain,
`https://www.fccareer.top` homepage, `/privacy` privacy policy and `/terms` terms
links. Production use requires the Audience publishing status to be **In
production**. This integration requests only the default basic identity scopes.

Apply `0008_google_login.sql` before deploying the API. Google identifiers are
unique and separate from email. Google-authoritative Gmail/Workspace emails automatically link existing accounts
and retain career data. An unverified old registration's password is cleared and upload key rotated
unless linking is initiated from an authenticated session of that account.
Existing third-party email accounts must first sign in normally and use the
Google button in Settings to prove ownership; there is no password-link dialog.
New Google accounts have no email/password login. Deleted or disabled
accounts cannot sign in or recreate an account using their existing email.
Google login issues the same application session used by REST and WebSockets.

Run `pnpm --filter @fc-career-top/backend test:google` for signature, audience,
issuer, nonce, expiry and account-linking tests, and `test:integration` against
the local API for the existing account/game-data regression suite.

## Upload key naming and password-manager behavior

Migration `0009_fct_upload_key_prefix.sql` replaces the historical `fcd-` prefix
with `fct-`, preserving the random suffix. Deploy the alias-aware API first,
then apply the migration. The API accepts either prefix for the same active
secret, so old Live Editor scripts continue uploading. Regenerating a key
changes its random suffix and invalidates both old prefix variants.

Settings displays keys as text with an optional reveal control, never as
password inputs. Login uses named email/password fields with `username` and
`current-password` autocomplete hints. Registration and password changes use
`new-password`; the password-change form includes the account email for
password-manager association. Browser credentials saved incorrectly in older
versions may still need to be removed in the user's password manager.

## Career/history upgrade (0011–0012)

Back up D1 and record current Worker deployment versions first. This is a two-phase upgrade: apply **0011 only** using a temporary Wrangler config whose `migrations_dir` includes migrations through 0011. It adds careers and history columns while retaining the old conflict indexes. Deploy the career-aware API, then apply **0012** using the normal config. The cutover reconciles in-flight legacy uploads, including accounts first uploading during the transition, and removes the old cross-career uniqueness constraints. Only after both migrations and API checks pass, deploy Frontend, Admin and Website. Do not publish the multi-career UI before 0012.

Existing rows are assigned to a default career per account/game version. Old scripts keep that target; new scripts include a fixed career ID. Recopying a script enables version metadata and per-career diagnostics. Historical detailed attributes and upload analytics are not invented or backfilled. Rewound saves need a separate career; no automatic timeline merge is performed.

After this schema cutover, rolling back the API to a pre-career version requires a deliberate schema/data recovery plan; use a compatible forward fix when possible. Never restore an old database over new user uploads without reconciling them.

## Verified release — 2026-10-17

Careers, sync status, growth summaries/comparisons, attribute history, upload conversion metrics, public demo and downloadable squad/player cards were deployed together. The interface uses separate Growth, Compare, History and Share views; detailed help is collapsed by default.

| Application | Deployed version |
| --- | --- |
| API | `011d822e-6205-4824-8c87-17ec5618c90d` |
| Frontend | `5f1f5b3a-8060-4577-8816-10f7485af7a7` |
| Admin | `77c701ab-177b-4cf5-8ca1-0c566a7437a9` |
| Website | `c2d715a2-cf99-468f-8aa8-cc22aa83cbbd` |

Production migrations through 0012 were applied. Builds/type checks, customer/Admin/Google regression tests, nonempty legacy migration tests, career isolation/history tests, Lua 5.3 and 5.4 simulations, website redirect checks, and desktop/mobile browser flows passed. Live production checks covered a disposable account, per-career uploads/history/notifications/watchlists, rewind protection, archive/restore, old-key compatibility, generated scripts, application pages and service-binding authentication. Test records were removed, and all original business records matched their pre-release fingerprints. Backups, deployment records and a source snapshot are retained privately outside Git. Actual Windows Live Editor gameplay was not exercised on this Mac.
