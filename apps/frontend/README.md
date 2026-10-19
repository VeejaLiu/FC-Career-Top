# FC Career Top Frontend

React 18 / Vite player dashboard in the [FC Career Top workspace](../../README.md).

- [Project overview and screenshots](../../README.md)
- [Player guide and Live Editor setup](../../docs/USER_GUIDE.md)
- [Development and environment configuration](../../docs/DEVELOPMENT.md)
- [Frontend pages and source layout](../../docs/components/frontend.md)

From the repository root: `pnpm dev:frontend` or `pnpm build:frontend`.

## UI regression checks

Run `pnpm --filter @fc-career-top/frontend test:ui` for calendar spacing,
invalid-date handling and post-login navigation. The production build also checks
TypeScript before bundling.

For browser verification, cover Career hub growth periods and watchlists;
one-, two- and three-player comparisons; current abilities and historical
attributes; an empty career's connection script and first-upload redirect; and
PNG previews. Check narrow layouts at 320/390 px and the five interface languages.
The website screenshots use only the fictional public demo.
