# Cloudflare deployment

[Documentation](README.md) · [Development](DEVELOPMENT.md) · [Database](DATABASE.md)

The project targets **Cloudflare Workers Free** with D1 and SQLite-backed Durable
Objects. The dashboard and website use static assets; the API keeps realtime WebSocket
notifications. Email verification and delivery are disabled.

| Application | Domain | Build output |
| --- | --- | --- |
| Website | `www.fccareer.top` | `apps/website/out` |
| Dashboard | `app.fccareer.top` | `apps/frontend/dist` |
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
