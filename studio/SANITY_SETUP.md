# Sanity production checklist

## Project

- Project ID: `edbqqkej`
- Dataset: `production`
- Studio path: `/studio`
- Website: `https://canvasrealestate.com.au`

## Before launch

1. Sign in from `studio/` with `npx sanity login`.
2. Deploy the schema with `npm run deploy:schema`.
3. Add `http://localhost:5173` and `https://canvasrealestate.com.au` in Sanity Manage → API → CORS origins.
4. Do not enable credentials for public published-content reads. Enable them only for authenticated preview/draft flows.
5. Publish Site Settings, Agents, page documents (`home`, `listings`, `rent`, `journal`, `about`, `contact`), listings, rentals, and journal articles.
6. Add a Sanity webhook that calls your hosting provider's private build hook when published route content changes. This regenerates `sitemap.xml` from Sanity.

## Seed the launch content

From the project root, sign in and run:

```bash
cd studio
npx sanity login
cd ..
npm run seed:dry-run
npm run seed
```

The seed command uploads the bundled website images and creates or updates Site Settings, six Pages, two Agents, four sale Listings, four Rentals, and six Journal articles. It publishes directly to the configured `production` dataset and is safe to rerun without duplicating documents.

## Sitemap rules

The build query includes published `page`, `listing`, `rental`, and `journalArticle` documents with a slug. Documents with `seo.noIndex == true` are omitted. `/studio` is never included.

## Secrets

No token belongs in `VITE_*` or `SANITY_STUDIO_*`. If the dataset is private, provide `SANITY_READ_TOKEN` only to a server-side API or build environment. Never commit it.
