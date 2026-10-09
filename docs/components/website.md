# Public website

[Documentation](../README.md) · [Development](../DEVELOPMENT.md) · [Deployment](../DEPLOYMENT.md)

The website in [apps/website](../../apps/website) is built with Next.js 15,
React 19, TypeScript, and Tailwind CSS. It introduces FC Career Top and exposes
public project information.

## Pages and assets

| Route | Purpose |
| --- | --- |
| `/` | Feature overview |
| `/change-logs` | Historical product updates |
| `/posts` | Posts page |
| `/contact-us` | Project contact links |
| `/user-statistics` | Public account statistics from the backend |

Routes and the shared navigation live in [src/app](../../apps/website/src/app).
Website feature images and fonts remain in [public](../../apps/website/public).
The root GitHub README's screenshots are stored separately in
[docs/assets/screenshots](../assets/screenshots).

From the workspace root, run `pnpm dev:website`, `pnpm build:website`, or
`pnpm start:website`. Development and static preview use port 3002. The build exports static files to
`apps/website/out`; Cloudflare serves them without a Next.js server.

Public statistics use `NEXT_PUBLIC_BACKEND_URL`. For the sitemap postbuild, set
`SITE_URL` in the build process environment; it defaults to `https://www.fccareer.top`.
The current Go to App target is in [layout.tsx](../../apps/website/src/app/layout.tsx).
See [deployment URL settings](../DEPLOYMENT.md#domain-and-url-configuration) before hosting it.
