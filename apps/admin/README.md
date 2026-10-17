# FC Career Top Admin

Independent React / Semi Design administrator console at https://admin.fccareer.top.
Fallback: https://fc-career-top-admin.veejaliu.workers.dev.

## Account model

Administrators use **usernames and passwords**, stored in `admin_account`.
Customers use the existing email/password account system in `user`. There is no
customer role flag, account promotion endpoint, shared password or shared session.
The same username or numeric ID in the two tables has no relationship or privilege.
Administrator accounts do not contribute to customer lists or growth statistics.

Admin authentication uses random, opaque sessions with an eight-hour absolute
expiry. D1 stores only SHA-256 session token hashes. Browsers receive a host-only
`__Host-fc_admin_session` cookie with Secure, HttpOnly and SameSite=Strict.
There is no administrator token in localStorage, sessionStorage, API JSON or URLs.
The old `fc-admin-token` storage entry is removed on startup.

Admin requests remain on the Admin origin. A small Worker forwards only
`/api/v1/admin/*` through an API service binding, avoiding cross-site cookie issues
on both formal and fallback domains. Mutations require an allowed Admin Origin.
The development Vite proxy targets the local API on port 8888 (override with
`ADMIN_DEV_API_URL`); localhost uses an HttpOnly development cookie.

## Local setup

Use the pinned Node/pnpm versions, install locked dependencies, copy the backend
`.dev.vars.example` if no local `.dev.vars` exists, then:

```sh
pnpm db:migrate
pnpm admin:create --username admin
pnpm dev
```

Admin opens at http://localhost:3003. `admin:create` creates an independent owner
and generates a random password. It prints a **private credential file path**, not
the password. Default output is a 0600 file in the system temporary directory.
Use `--output /private/path.json` to select another destination. Files inside the
repository must be Git-ignored; existing credential files are never overwritten.
An existing customer account is not needed. Public registration cannot create admins.

## Features and permissions

- Overview and Users: customer-only statistics, search, filtering and account details.
- User operations: disable/restore access, revoke customer sessions and rotate upload keys.
- Players: game/user/archive filters, profiles and latest 100 history records.
- Script errors: recent Lua diagnostics, game/version/user search, daily grouping,
  received-report counts, environment details and redacted call stacks. Owners
  and operators can view reports; customer tokens cannot access them. Requires
  API migration `0010_lua_error_reports.sql` and users copying the new script.
- Administrators: owners create owner/operator accounts and enable/disable them.
- Account security: change own password, inspect own sessions, revoke other devices.
- Audit: immutable actor username snapshots, explicit target type/ID, action and time.
- System: database connection, supported games and server time.

Operators can manage customers and game data, but cannot list or manage other
administrator accounts. Only owners can provision/disable administrators. The API
prevents self-disabling and removing the last active owner. Disabling an admin or
changing their password revokes all their sessions. Admin logout revokes the
current session; it does not sign customers out. Customer actions cannot modify
administrator credentials or sessions. Account mutations and audit writes use the
same D1 batch. Audit logs never include passwords, session tokens or upload keys.

## Migration from the initial version

`0006_independent_administrators.sql` copies old administrator password hashes,
usernames and audit events into dedicated tables, invalidates their old customer
identity, and leaves customers untouched. Deploy the new API and confirm username
login before applying `0007_remove_legacy_admin_identities.sql`.

`0007` removes only the mapped administrator customer rows, their obsolete upload
keys/settings/activity, the old audit table and `user.is_admin`. It first refuses
cleanup if any mapped identity has player/history/notification business data.
It never broadly clears the customer or game tables. Fresh local installations
can apply both migrations in order. Production upgrades use expand/deploy/contract.
Old browser sessions expire during the authentication transition; sign in again
with the **same administrator username and password**.

## Commands and deployment

```sh
pnpm dev:admin
pnpm build:admin
pnpm --filter @fc-career-top/backend test:admin
pnpm deploy:backend
pnpm deploy:admin
```

The integration suite migrates a disposable legacy account, verifies cleanup,
checks cross-domain token/ID isolation, owner/operator controls, password/session
lifecycle, moderation and the existing customer API, then tests the real Admin
Worker service binding. It never targets production or normal local data.
`--serve` keeps isolated fixtures until interrupted for browser checks.

The Admin Worker binds `API` to `fc-career-top-api` and `ASSETS` to `dist`.
Build before publishing. Generate Worker bindings after config changes with
Wrangler types. Both exact Admin origins belong in API `ADMIN_ALLOWED_ORIGINS`;
normal customer origins must not be added to that administrator whitelist.
Management browser requests have no public backend URL setting or embedded secrets.
The legacy Node/MySQL backend does not implement administrator authentication.

The “接入与上传” page uses a shared 30-day registration cohort for registration → first successful upload → a second distinct in-game date. It also shows first-upload delay, daily authenticated upload attempts and failure rates by script version. Events start with the career release; legacy history is not interpreted as complete upload telemetry. Requests that never reach the API or fail before a career is authenticated are not included in upload request rates. Script diagnostics remain available separately.
