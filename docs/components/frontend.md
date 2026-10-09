# Player dashboard

[Documentation](../README.md) · [Development](../DEVELOPMENT.md) · [Player guide](../USER_GUIDE.md)

The dashboard in [apps/frontend](../../apps/frontend) is built with React 18,
TypeScript, Vite, Semi UI, and Recharts. It provides the player-facing interface.

## Pages

| Route | Purpose |
| --- | --- |
| `/` and `/players` | Searchable squad list and position-ranking badges |
| `/players-trends` | Overall/potential growth charts |
| `/players-detail?id=...` | Individual attributes, PlayStyles, and history |
| `/get-started` | Account-specific FC 24/25 Lua script and setup instructions |
| `/settings` | Account, email verification, API key, and notifications |

Authentication controls whether the dashboard or login/registration interface is
shown. The interface supports English, Simplified Chinese, French, German, and Japanese.

## Source layout

- [src/pages](../../apps/frontend/src/pages): page components.
- [src/service](../../apps/frontend/src/service): user, player, and notification API clients.
- [src/components](../../apps/frontend/src/components): authentication and notification components.
- [src/locales](../../apps/frontend/src/locales): interface translations.
- [src/constant/user-script.ts](../../apps/frontend/src/constant/user-script.ts): Lua templates used by Get Started.

Use the generated script from Get Started when connecting a game; that page adds
the current account key, upload URL, and selected game version to the template.

From the workspace root, run `pnpm dev:frontend` or `pnpm build:frontend`.
The production output is `apps/frontend/dist`. Configure the three `VITE_*` URLs
using the shared [environment guide](../DEVELOPMENT.md#dashboard-and-website).
