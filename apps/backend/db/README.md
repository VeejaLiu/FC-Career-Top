# Database migrations

Use MySQL 8.4 and the Flyway Open Source CLI, pinned to
`flyway/flyway:13.10.0-alpine`. Flyway runs in a temporary Docker container and
reuses the `MYSQL_*` settings in `apps/backend/.env`. Docker must be running.

## First setup

Create an empty database once, using your MySQL client:

```sql
CREATE DATABASE fcd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

Set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USERNAME`, and
`MYSQL_PASSWORD` in the backend environment file. The database user must have
permission to create and alter tables. From the repository root:

```sh
pnpm db:info      # Show applied and pending migrations
pnpm db:migrate   # Apply pending migrations
pnpm db:validate  # Verify applied versions and checksums
pnpm dev:backend
```

`V1__initial_schema.sql` creates the complete current schema, including all
changes from the former `sql/init.sql`. Flyway creates `flyway_schema_history`
to track successful versions. Subsequent migrate runs apply only pending versions.

The container translates a local `MYSQL_HOST` (`localhost` or `127.0.0.1`) to
`host.docker.internal`. MySQL must be reachable from Docker. For a different
network or JDBC connection configuration, set `FLYWAY_URL` in the same environment
file; the username and password still come from the `MYSQL_*` settings.

## Making schema changes

1. Add the next file, such as `migrations/V2__add_player_index.sql`.
2. Update the Sequelize model if its fields change.
3. Run `pnpm db:migrate`, then `pnpm db:validate`, before starting the application.

Once a migration has been applied, keep its name and contents unchanged. Correct
an applied migration with a new version. Migrate validates earlier migrations
before applying new ones, and invalid filenames fail instead of being ignored.
Sequelize describes the models; versioned SQL owns the database structure.

Reference: [Flyway migrate](https://documentation.red-gate.com/flyway/reference/commands/migrate)
and [Flyway validate](https://documentation.red-gate.com/flyway/reference/commands/validate).
