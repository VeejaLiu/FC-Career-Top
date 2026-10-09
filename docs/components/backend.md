# Backend API

[Documentation](../README.md) · [Development](../DEVELOPMENT.md) · [Database](../DATABASE.md)

The default backend is a TypeScript Cloudflare Worker backed by **D1**. A
SQLite-backed **Durable Object** runs API operations and owns hibernating WebSocket
connections. Existing frontend and Lua request/response formats are preserved.

| Interface | Purpose |
| --- | --- |
| `GET /api/health_check` | Returns `ok` |
| `/api/v1/user` | Email/password registration and login, settings, password and API keys |
| `/api/v1/player` | Squad counts, details, trends, and bulk uploads |
| `/api/v1/notification` | Notification listing, unread counts, and read state |
| `/api/v1/public` | Website statistics |
| `/ws` | Realtime player-change notifications |

Browser requests use the `token` header; Lua uploads use `secret-key`.
WebSocket connections carry the token as their subprotocol. Email verification routes return
HTTP 410; there is no verification requirement. Password changes, logout, and a
new login invalidate the previous session and close its connections.

## Source layout

- [src/worker/index.ts](../../apps/backend/src/worker/index.ts): routing, D1 operations, Durable Object, WebSocket and rate limits.
- [src/worker/auth.ts](../../apps/backend/src/worker/auth.ts): HS256 tokens and password validation.
- [src/worker/players.ts](../../apps/backend/src/worker/players.ts): snapshot normalization and frontend DTOs.
- [db/d1-migrations](../../apps/backend/db/d1-migrations): versioned SQLite schema.
- [wrangler.jsonc](../../apps/backend/wrangler.jsonc): bindings, domains, and Durable Object migrations.
- [tests/worker.integration.mjs](../../apps/backend/tests/worker.integration.mjs): API and realtime integration coverage.

Username and email comparison is case insensitive. New accounts require a valid,
unique email address; login uses email, and email is displayed in account settings.
Usernames are generated from the email prefix plus four random lowercase letters or
digits; collisions are retried. Bcrypt uses 10 rounds. Tokens expire in
seven days and must also match the stored session. Registration/login/upload rate
limits persist in Durable Object storage. Browser origins use an explicit allowlist;
Lua clients without an Origin header are supported. Data queries isolate accounts
and game versions. Snapshot writes are atomic and reject older career dates.

## Legacy backend

The original Express/MySQL implementation remains in `src/router`, `src/general`,
`src/models`, and `src/lib`, with its Flyway migrations. It is not bundled into the
Worker. Its commands have `:node` or `:mysql` suffixes, for example `dev:node`,
`build:node`, and `db:migrate:mysql`. It retains the older email-based flows and
requires its own `.env` and database setup.
