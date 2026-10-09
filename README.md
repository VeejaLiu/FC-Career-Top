# FC Career Top

Automatically track player development in EA FC 24/25 Career Mode. Live Editor
Lua scripts collect squad data, the API stores player history, and the dashboard
shows ratings, potential, attributes, trends, and change notifications.

This repository combines the original FCT-Frontend, FCT-Website, and FCT-Backend
repositories into one pnpm workspace. Each application keeps its own framework,
configuration, and deployment target.

| Application | Directory | Technology | Development address |
| --- | --- | --- | --- |
| Player dashboard | [apps/frontend](apps/frontend) | React 18, Vite, Semi UI, Recharts | http://localhost:3000 |
| Public website | [apps/website](apps/website) | Next.js 15, React 19, Tailwind CSS | http://localhost:3002 |
| API and notifications | [apps/backend](apps/backend) | Express 5, Sequelize, MySQL, WebSocket | http://localhost:8888 |

## Getting started

Use Node.js 22.13.1 and pnpm 10.5.0. With nvm and Corepack installed:

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` with your local database credentials, a random JWT secret,
and a Resend API key. Initialize a **local** MySQL database with
[apps/backend/sql/init.sql](apps/backend/sql/init.sql). The backend expects its
configuration in `apps/backend/.env`; root commands run each app in its own directory.

The frontend and website include public development and production URLs. Override
them in the application's `.env.local` or `.env.development.local` when needed.
All `VITE_*` and `NEXT_PUBLIC_*` values are public browser configuration; never put
credentials in them. Backend `.env` files are ignored by Git.

```sh
# Start all three applications
pnpm dev

# Or start one application
pnpm dev:frontend
pnpm dev:website
pnpm dev:backend
```

The website uses port 3002 during development so it can run alongside the dashboard.
Production URLs and API routes remain the same. See the
[frontend guide](apps/frontend/README.md) for Live Editor setup and screenshots.

## Build and check

```sh
pnpm typecheck
pnpm build

# Build just one application
pnpm build:frontend
pnpm build:website
pnpm build:backend
```

The frontend outputs `apps/frontend/dist`, Next.js outputs `apps/website/.next`,
and the backend outputs `apps/backend/dist`. After building, run
`pnpm start:backend` or `pnpm start:website`. Next.js production serving defaults
to port 3000; set `PORT` if a different port is required.

## Repository history and deployment

The original frontend repository is the canonical repository, renamed to
**FC-Career-Top**. The default-branch commit histories from all three repositories
remain reachable without rewriting commit IDs. Frontend release tags are retained.
The original backend license remains at [apps/backend/LICENSE](apps/backend/LICENSE)
and applies to that application; this migration does not change licensing.

See [docs/MONOREPO.md](docs/MONOREPO.md) for source revisions, deployment roots,
and migration notes. Database changes and production deployment are separate from
this repository consolidation.
