# Public website

[Documentation](../README.md) · [Development](../DEVELOPMENT.md) · [Deployment](../DEPLOYMENT.md)

The website in [apps/website](../../apps/website) is built with Next.js 15,
React 19, TypeScript, and Tailwind CSS. It introduces FC Career Top and exposes
public project information.

## Pages and assets

| Route | Purpose |
| --- | --- |
| `/` | Feature overview |
| `/get-started` | Public Windows / Live Editor setup and troubleshooting guide |
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

Public statistics use `NEXT_PUBLIC_BACKEND_URL`. Metadata, canonical URLs, structured
data, `robots.txt` and `sitemap.xml` share the origin defined in `src/lib/seo.ts`:
`SITE_URL`, then `NEXT_PUBLIC_SITE_URL`, then `https://www.fccareer.top`.
Production builds must use the public HTTPS website origin. Next.js exports the
robots and sitemap routes directly; there is no sitemap postbuild step.
The legacy `/sitemap-0.xml` URL redirects to `/sitemap.xml` through the static
assets `_redirects` file. Remove ignored, previously generated `public/robots.txt`
and `public/sitemap*.xml` files when upgrading an existing checkout; the native
metadata routes now generate these outputs.
The client-loaded statistics page is `noindex, follow` and is excluded from the
sitemap. It remains accessible through the footer. Sitemap dates are omitted
until actual content modification dates are maintained.

Each content page defines its own title, description, canonical URL and Open
Graph / Twitter preview. The homepage describes the website and web application
in JSON-LD, and content pages render breadcrumbs with matching structured data.
There are no invented ratings or review counts; application rich results are not
guaranteed. The website is English-only, so it does not advertise translated
`hreflang` alternatives for the dashboard's five languages.

The 1200×630 social preview is `public/og-image.png`. Regenerate it with
`pnpm --filter @fc-career-top/website generate:social-image` after changing its
artwork in `scripts/generate-social-image.mjs`.

After deployment, submit `/sitemap.xml` in the site's Google Search Console
property and inspect the homepage and setup guide. Search impressions, indexing,
rankings and field Core Web Vitals require live data; a successful build does not
confirm them. The separate `wrangler.redirects.jsonc` Worker redirects the apex
host to the HTTPS `www` origin with HTTP 301; it must be deployed separately and
the apex DNS record must be proxied. HTTP-to-HTTPS enforcement and bot restrictions
are managed by the hosting account and should be verified there.
The Go to App target is `APP_URL` in [seo.ts](../../apps/website/src/lib/seo.ts).
See [deployment URL settings](../DEPLOYMENT.md#domain-and-url-configuration) before hosting it.
