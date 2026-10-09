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
| `/settings` | Username, email, password, API key, and notifications |

Authentication controls whether the dashboard or login/registration interface is
shown. The interface supports English, Simplified Chinese, French, German, and Japanese.

## Source layout

- [src/pages](../../apps/frontend/src/pages): page components.
- [src/service](../../apps/frontend/src/service): user, player, and notification API clients.
- [src/components/layout](../../apps/frontend/src/components/layout): application header and navigation destinations.
- [src/components](../../apps/frontend/src/components): authentication, notifications, shared player avatars/charts, and responsive popups.
- [src/hooks](../../apps/frontend/src/hooks): viewport detection and asynchronous resource lifecycle.
- [src/common/language-options.ts](../../apps/frontend/src/common/language-options.ts): shared language menu options.
- [src/locales](../../apps/frontend/src/locales): interface translations.
- [src/constant/user-script.ts](../../apps/frontend/src/constant/user-script.ts): Lua templates used by Get Started.

Use the generated script from Get Started when connecting a game; that page adds
the current account key, upload URL, and selected game version to the template.

From the workspace root, run `pnpm dev:frontend` or `pnpm build:frontend`.
The production output is `apps/frontend/dist`. Configure the three `VITE_*` URLs
using the shared [environment guide](../DEVELOPMENT.md#dashboard-and-website).

## Frontend assessment and extension rules

The existing page/service/locale separation is suitable for this application's
current size. The October 2026 cleanup adds explicit boundaries for layout,
resource state, and reusable presentation. These are the foundations to extend;
the application should not be described as fully standardized yet.

- `App.tsx` owns the route tree and lazy page loading. The header and navigation
  live in `components/layout`; add destinations to `navigation.tsx`.
- `useAsyncResource` handles loading, errors, retries, and ignoring stale results.
  Pass a stable API method or a loader created with `useCallback`. Player data
  methods propagate request failures to this hook instead of presenting a
  network failure as an empty squad. Keep loading, empty, and failed states
  distinct in new pages.
- Player detail selection lives in the `id` search parameter. Preserve this
  contract for deep links, reloads, and browser history.
- `PlayerAvatar`, `PlayerTrendChart`, `comparePlayerPosition`, and
  `ResponsivePopover` are shared building blocks. Reuse them rather than copying
  chart markup, error handlers, sorting rules, or popup placement into pages.
- Add labels to all five locale files. Keep language normalization and menu
  options in `common`, independently of the authentication component.
- Never log tokens, generated scripts containing account keys, or API keys.

### Responsive layout contract

- The mobile breakpoint is **767px** in both `MOBILE_QUERY` and CSS. Keep those
  definitions aligned when changing it.
- `App.css` defines page spacing, maximum content width, corner radius, and
  accent tokens. Use `page-container` and scoped page classes for new pages.
- The shell uses flex layout with a dynamic viewport-height fallback, so the
  content region does not depend on a hard-coded navigation-height offset.
- Flex/grid children that contain data must allow shrinking (`min-width: 0`).
  Avoid viewport-wide children or fixed minimum widths at page level.
- On mobile, the squad uses searchable, sortable cards; desktop retains the
  sortable table. Table scrolling and code scrolling stay within their own
  containers. The navigation may scroll horizontally when labels do not fit.
- Charts use a sized parent and `ResponsiveContainer`. Render a history brush
  only when at least two points exist. Do not use fixed chart widths.
- Detail attributes use three columns on large screens, two on intermediate
  screens, and one below 390px; the player profile stacks above attributes on
  mobile. The mobile player selector supports searching and identifies players
  by ID as well as name.
- Mobile informational popups use `ResponsivePopover`'s dismissible full-width
  sheet. Desktop retains anchored popups. Use real buttons for tap/keyboard
  actions, visible focus states, and approximately 44px control heights.
- Login and registration use native form submission, so the keyboard's submit
  action works. Account changes still require an explicit user action.

### Remaining improvements, in order

1. **API contracts and shared transport:** consolidate repeated authentication
   headers and request configuration across user/player/notification clients;
   add typed response/error contracts, cancellation, and request deduplication.
   The shared resource hook currently prevents stale UI updates; it does not
   cancel network requests or cache responses.
2. **Typed localization and domain models:** replace remaining `any` locale and
   account values, check translation-key parity, and separate model definitions
   from transport implementation as the domain grows. Some player details and
   notification messages still contain English text.
3. **Critical-flow regression coverage:** retain a small automated suite for
   login, search/sort, detail history, retries, notification pagination, and
   multilingual narrow layouts. Existing smoke checks are not a persistent test
   suite.
4. **Performance and dependency maintenance:** page and chart code now load in
   separate chunks, but the Semi UI entry bundle remains large. Review actual
   bundle composition and third-party compatibility warnings before changing
   versions or splitting additional libraries.

### Verification on 2026-10-09

Browser checks used the Codex sidebar browser and temporary intercepted fixtures;
no player or notification fixtures were written to the backend. The supplied
account had an empty FC 25 squad, which was also checked with real responses.

- Main-page widths: **320, 360, 375, 390, 430, 768, 1024, 1280px**. Squad,
  trends, detail, settings, and Get Started had no page-level horizontal overflow.
- Five-language checks covered narrow login/registration layouts and the main
  pages, including long names and French/German labels.
- Functional checks included player search, default detail selection, selector
  changes, browser back/forward, notification pagination/close, PlayStyle sheets,
  empty/single-point chart histories, a failed player request, and successful
  recovery using Retry. Real login succeeded through keyboard submission.
- The local screenshot and measurement record are under ignored
  `output/playwright/`; the screenshot uses clearly labeled test players.
- Frontend TypeScript checks, full-source ESLint with zero allowed warnings,
  the production build, and whitespace checks passed. The build still reports
  third-party compatibility warnings and a large shared entry chunk (about
  1.26 MB minified / 384 KB gzip); these remain performance/maintenance work.

These are browser layout and interaction checks. Physical iOS/Android devices,
Safari/Firefox engines, keyboard viewport changes, safe-area rendering, and
large production squads still need their own acceptance run.
