# FC Career Top Backend

Cloudflare Worker / D1 API and notifications in the [FC Career Top workspace](../../README.md).

- [Development and environment configuration](../../docs/DEVELOPMENT.md)
- [Database migrations](../../docs/DATABASE.md)
- [API interfaces and source layout](../../docs/components/backend.md)
- [Deployment](../../docs/DEPLOYMENT.md)

From the repository root: `pnpm dev:backend`, `pnpm build:backend`, or `pnpm start:backend`.
Apply pending schema migrations with `pnpm db:migrate` before starting updated code.

## Lua diagnostics

Apply `0010_lua_error_reports.sql` before deploying the updated API. The dashboard
build embeds the new script; users must copy and execute it again to enable reports.
The legacy Node/MySQL backend does not implement this feature.

`POST /api/v1/lua/errors` authenticates with the existing `secret-key` header
(including the legacy `fcd-` alias). Disabled accounts and revoked keys cannot report.
Only game/script/editor version, stage, message, traceback, event ID, HTTP status
and career date are stored. The authenticated key determines the user; arbitrary
request headers, player data, and client-supplied user IDs are ignored.
Both the Worker and actor limit the request to 16 KB. The server redacts the key,
common credential patterns, URL credentials/query strings, email strings and
home-directory usernames. This is best-effort scrubbing, not arbitrary-data DLP.

The Lua reporter works without the imported JSON module, catches initialization,
snapshot and event exceptions with `xpcall`, and reports HTTP/acknowledgement
failures. It uses the same native HTTP / Windows curl transport as player uploads,
with a separate **2-second** timeout. Same-stage/message errors report at most once
per 5 minutes; at most 20 attempts per hour survive re-execution in the same Lua VM.
Reporting failures suppress all further attempts for 5 minutes and never recurse.
Server limits are 20 requests per customer per 10 minutes (across IPs), and 60 per
IP per 10 minutes. Diagnostic limits are separate from player-upload limits.

Admin `GET /api/v1/admin/lua-errors` supports pagination, `gameVersion`, `userId`,
and `q` (message/stage/script version/username). Owners and operators can read it;
customer session tokens cannot. Groups are keyed by customer, UTC day and a hash
of version/stage/redacted message. Counts reflect **received reports**, not every
local occurrence. Only the latest 30 UTC days appear; old groups are deleted in
the next successful intake transaction. There is no daily cleanup cron.

Syntax errors before script execution, native crashes, and errors in unrelated
scripts cannot be collected. When the server/network is unreachable, diagnostics
remain best effort with a local message; they are not persisted or retried offline.

Tests: `pnpm --filter @fc-career-top/backend test:admin` uses disposable local
storage. `LUA_BIN=/path/to/lua pnpm --filter @fc-career-top/frontend test:lua`
executes the actual template with simulated Live Editor APIs (Lua 5.3+).
