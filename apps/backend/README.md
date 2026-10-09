# FC Career Top Backend

API and WebSocket notifications for FC Career Top, built with Express, Sequelize,
and MySQL. This application is part of the [FC Career Top workspace](../../README.md).

Use Node.js 22.13.1 and pnpm 10.5.0. From the repository root:

```sh
pnpm install --frozen-lockfile
cp apps/backend/.env.example apps/backend/.env
```

Edit the environment file with your local MySQL credentials, JWT secret, and
Resend API key. Initialize a local database with [sql/init.sql](sql/init.sql),
then start the API:

```sh
pnpm dev:backend
```

The default address is `http://localhost:8888/api`. The WebSocket endpoint shares
the same server at `ws://localhost:8888`. The monitor is disabled in the example
configuration; enable it only after setting a monitor password.

For a compiled build:

```sh
pnpm build:backend
pnpm start:backend
```

The compiled entry point is `dist/src/app.js` relative to this application.
Commands launched through the workspace run from `apps/backend`, so its `.env`
file and relative log paths continue to work.
