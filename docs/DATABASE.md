# Database migrations

[Documentation](README.md) · [Development](DEVELOPMENT.md) · [Backend](components/backend.md)

The Cloudflare backend uses **D1 (SQLite)** and Wrangler's versioned migrations.
There is no deployment-time `init.sql` and no database server to maintain.

## Initialize

From the repository root:

```sh
pnpm db:migrate          # Apply pending migrations to local D1
pnpm db:info             # List pending local migrations
pnpm db:migrate:remote   # Apply pending migrations to deployed D1
```

Remote commands require Wrangler login and the real database ID in
`apps/backend/wrangler.jsonc`; see [deployment](DEPLOYMENT.md).
Local commands do not require a Cloudflare account.

[0001_initial_schema.sql](../apps/backend/db/d1-migrations/0001_initial_schema.sql)
creates accounts, keys, settings, player snapshots, history, and notifications.
Wrangler records applied filenames in `d1_migrations` and skips them on subsequent runs.

## Schema changes

1. Add the next SQL file, for example `0002_add_player_index.sql`, in `apps/backend/db/d1-migrations`.
2. Update the Worker queries and field mapping if necessary.
3. Apply locally, test, then apply remotely before deploying code that needs the schema.

Keep applied migration names and contents unchanged; corrections go in a new file.
D1 migrations do not provide Flyway checksum validation. `pnpm db:validate` is a
compatibility alias for listing pending D1 migrations, not checksum validation.
Uploads use a transactional D1 batch and unique history keys so repeated snapshots
for the same player/date update that entry.

## Legacy MySQL/Flyway

The original Node backend remains available for reference. Its `.env.example`,
Sequelize models, `db/migrations/V1__initial_schema.sql`, and Flyway configuration
are preserved. It is not the Cloudflare runtime.

For that backend only, configure MySQL 8.4 and Docker, create an empty `fcd` database,
then use `pnpm --filter @fc-career-top/backend db:migrate:mysql` and
`db:validate:mysql`. Flyway is pinned to `flyway/flyway:13.10.0-alpine`; its wrapper
uses the `MYSQL_*` values in `apps/backend/.env` and translates local hosts to
`host.docker.internal`. Add subsequent `V2__...sql` files for that database.

References: [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
and [Flyway validation](https://documentation.red-gate.com/flyway/reference/commands/validate).

## Extended player data

Migration `0004_add_player_profile.sql` adds `player.player_profile`, a JSON
text column for version-specific player fields, optional related career rows,
season statistics, trait masks and source availability. It stores the latest
profile; the existing growth history remains overall rating and potential.
See [player data support](PLAYER_DATA_SUPPORT.md) for the field/source contract.
