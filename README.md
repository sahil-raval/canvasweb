# Canvas Real Estate — Website + Sanity Studio

A deployment-ready monorepo with two sibling applications:

- `web/` — Canvas Real Estate website
- `studio/` — standalone Sanity Studio source, mounted at `/studio` when built

The Studio remains independently maintained in `studio/`; it is not embedded into the website source. Its production output is placed inside `web/dist/studio/` so both can be hosted on one domain.

## First run

Requires Node.js 22.12 or newer.

```bash
cp web/.env.example web/.env
cp studio/.env.example studio/.env
npm install
npm run dev
```

Open:

- Website: http://localhost:5173
- CMS through the website: http://localhost:5173/studio
- Direct Studio dev server: http://localhost:3333/studio

## Production hosting

```bash
npm run build
```

A prebuilt `web/dist/` is included for direct upload. After changing content configuration or source code, run `npm run build` and publish the complete `web/dist/` folder. The build creates:

```text
web/dist/
├── index.html
├── assets/
└── studio/
    └── index.html
```

The resulting production URLs are:

- `https://yourdomain.com/`
- `https://yourdomain.com/studio`

The included hosting rules support common providers:

- Netlify and compatible hosts: `web/public/_redirects`
- Apache/cPanel hosting: `web/public/.htaccess`
- Vercel: `web/vercel.json`

For another provider, add these SPA rewrites in this order:

1. `/studio/*` → `/studio/index.html`
2. All non-file website routes → `/index.html`

### Keep the sitemap current

The sitemap is generated from published Sanity documents during `npm run build`. In your hosting provider, create a deploy/build hook and trigger it from a Sanity webhook for create, update, publish, unpublish, and delete events. This rebuilds the site and sitemap whenever route content changes. Keep the build-hook URL private.

## Sanity login and project access

The package uses Sanity project `edbqqkej` and dataset `production`.

```bash
cd studio
npx sanity login
npm run deploy:schema
npm run cors:web
```

`cors:web` authorizes `http://localhost:5173`. Before production launch, add `https://yourdomain.com` as an allowed CORS origin in Sanity Manage. Enable credentials only if the production website will use authenticated draft or preview requests.

## Sanity wiring

Every production build queries published Sanity route documents and regenerates `web/public/sitemap.xml`. The sitemap includes pages, sale listings, rentals, and journal articles, uses `_updatedAt` for `lastmod`, respects `seo.noIndex`, and excludes `/studio`.

Website content is loaded from Sanity for listings, rentals, journal articles, agents, site settings, page hero copy, contact details, social links, and route SEO. Bundled content is used only when Sanity is unavailable, not when an authoritative Sanity collection is intentionally empty.

Published changes are requested from Sanity's origin API with browser caching disabled. The website refreshes CMS content every 15 seconds and immediately when a visitor returns to or focuses the tab, so text, images, listings, rentals, agents, and route SEO update without rebuilding the website. Draft changes remain private until they are published.

## CMS model

- Site Settings singleton
- Sale listings and Statements of Information
- Rentals
- Journal articles
- Reusable agent references
- General pages
- Shared SEO and social-sharing fields

The Studio includes curated navigation, grouped forms, validation, document previews, image hotspots, singleton protection, Vision, schema deployment, and TypeGen configuration.

## Security

No Sanity API token is included. Project ID and dataset are public configuration. Never add a token to `VITE_*` or `SANITY_STUDIO_*` variables. Private-dataset reads require a server-only API route and an unprefixed secret.

## Commands

```bash
npm run dev          # website and Studio
npm run dev:web      # website only
npm run dev:studio   # Studio only
npm run build        # build website, then mount Studio at /studio
npm run typecheck    # website TypeScript
npm run typegen      # generate Sanity types for the website
```
