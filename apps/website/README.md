# FC Career Top Website

The public FC Career Top website, built with Next.js 15 and React 19. It includes
the landing page, change log, posts, contact page, and public user statistics.
This application is part of the [FC Career Top workspace](../../README.md).

From the repository root, using Node.js 22.13.1 and pnpm 10.5.0:

```sh
pnpm install --frozen-lockfile
pnpm dev:website
```

Open `http://localhost:3002`. Public development URLs are configured in
`.env.development`; override them with `.env.local` when needed. Only public
configuration belongs in `NEXT_PUBLIC_*` variables.

```sh
pnpm build:website
pnpm start:website
```

Production serving defaults to port 3000, matching the original application.
Set `PORT` when another port is required. Sitemap generation remains a postbuild
step and uses `SITE_URL` or `https://www.fccareer.top`.
