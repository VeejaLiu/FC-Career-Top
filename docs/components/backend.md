# Backend API

[Documentation](../README.md) · [Development](../DEVELOPMENT.md) · [Database](../DATABASE.md)

The service in [apps/backend](../../apps/backend) uses TypeScript, Express 5,
Sequelize, MySQL, WebSocket, and Resend. It stores player snapshots and growth
history, manages accounts, and generates change notifications.

## Interfaces

| Interface | Purpose |
| --- | --- |
| `GET /api/health_check` | Returns `ok` when the HTTP server is running |
| `/api/v1/user` | Registration, login, account settings, email verification, and API keys |
| `/api/v1/player` | Squad data, counts, player details, trends, and bulk uploads |
| `/api/v1/notification` | Notification list, unread counts, and read state |
| `/api/v1/public` | Public statistics used by the website |
| WebSocket on the same server | Delivers player-change messages to connected users |

Browser API clients use the `token` header. Lua bulk uploads use the `secret-key`
header. WebSocket clients pass their token through the connection subprotocol.

## Source layout

- [src/router](../../apps/backend/src/router): route definitions and request validation.
- [src/general](../../apps/backend/src/general): account, player, and notification operations.
- [src/models/schema](../../apps/backend/src/models/schema): Sequelize models.
- [src/lib](../../apps/backend/src/lib): tokens, email, logging, and WebSocket helpers.
- [db/migrations](../../apps/backend/db/migrations): versioned Flyway SQL.
- [scripts/flyway.cjs](../../apps/backend/scripts/flyway.cjs): the Docker Flyway command wrapper.

From the root, run `pnpm dev:backend`, `pnpm build:backend`, or `pnpm start:backend`.
The compiled entry point is `apps/backend/dist/src/app.js`. Connection and email
configuration are documented in [Development](../DEVELOPMENT.md#backend).
Flyway owns schema changes; Sequelize describes and queries the resulting tables.
