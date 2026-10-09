# First deployment

[Documentation](README.md) · [Development](DEVELOPMENT.md) · [Database](DATABASE.md)

There is currently no live deployment. These are the build and configuration steps
for hosting the three applications from this repository.

## Prepare

1. Install the pinned Node.js and pnpm versions from the [development guide](DEVELOPMENT.md).
2. Run `pnpm install --frozen-lockfile` from the repository root.
3. Configure the backend environment, database connection, JWT secret, and email sender.
4. Configure the public browser URLs for your actual hosts before building.
5. Run `pnpm db:migrate`, then `pnpm build` and `pnpm typecheck`.

| Application | Working directory | Build command from root | Output / serving |
| --- | --- | --- | --- |
| Dashboard | `apps/frontend` | `pnpm build:frontend` | Serve `apps/frontend/dist` as static files |
| Website | `apps/website` | `pnpm build:website` | `pnpm start:website` serves `apps/website/.next` |
| Backend | `apps/backend` | `pnpm build:backend` | `pnpm start:backend` runs `apps/backend/dist/src/app.js` |

## Host configuration

- The dashboard uses browser routes; configure its static host to fall back to `index.html`.
- Next.js production serving defaults to port 3000. Set `PORT` in its environment if needed.
- The backend uses `APP_PORT`, with 8888 in the example environment. REST routes
  start at `/api`; WebSocket connections share the same HTTP server.
- A reverse proxy serving WebSocket traffic must forward connection-upgrade headers.
- Keep the backend environment file at `apps/backend/.env`. Root start commands
  select the application's working directory automatically.

## Public URLs and email

The committed production environment files contain the project's planned
`fccareer.top` domain URLs. Set your actual URLs in the apps' `.env.production.local`
files before building:

- Dashboard: `VITE_APP_BACKEND_URL`, `VITE_POST_PLAYER_URL`, and `VITE_WS_URL`.
- Website: `NEXT_PUBLIC_BACKEND_URL`.

For sitemap generation, set `SITE_URL` in the build process environment, read by
`apps/website/next-sitemap.config.js`. For example:

```sh
SITE_URL=https://www.example.com pnpm build:website
```

The website's **Go to App** link is currently written in
[layout.tsx](../apps/website/src/app/layout.tsx). Update it if your dashboard uses
another address. Configure `APP_BACKEND_URL` and the backend email sender for the
deployment, following [email setup](DEVELOPMENT.md#backend).

Before starting updated backend code, apply pending Flyway migrations. Add new
versioned SQL files for later schema changes; see the [database guide](DATABASE.md).

## Build helper

[scripts/build.sh](../scripts/build.sh) installs the locked dependencies and builds
all applications from the repository root. Run it with `bash scripts/build.sh`.
Process setup and database migration use the steps above.
