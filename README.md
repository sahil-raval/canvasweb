# Canvas Real Estate website

Next.js (App Router) website with Sanity CMS. Property listings come from **Agentbox**.

```
Agentbox ──XML──▶ FeedSync ──▶ /api/feedsync-sync ──▶ Sanity ──▶ Next.js pages (server-rendered)
                                                     ▲
                              Sanity Studio (/studio) ┘  pages, journal, agents, SEO
```

## Project layout

```
src/
  app/                  routes (pages, API, sitemap.xml, robots.txt, llms.txt)
    api/feedsync-sync   Agentbox → Sanity listing sync
    api/revalidate      Sanity webhook → refresh website cache
    api/enquiry         enquiry forms → email (Resend)
  views/                page UI (client components)
  components/           shared UI (Navbar, Footer, ListingCard, forms)
  lib/cms/              content types, GROQ query, server fetch (cached), React context
  lib/agentbox/         REAXML parser + sync rules
  lib/seo.ts            metadata + schema.org JSON-LD
studio/                 Sanity Studio (built into public/studio, served at /studio)
email-templates/        enquiry emails
public/images/          static images
```

## How content flows

- Every page is rendered on the server with real content in the HTML, so Google and AI
  search tools (ChatGPT, Perplexity, Gemini) can read it.
- Pages are cached. The cache is refreshed when:
  - the Agentbox sync changes a listing (instant),
  - something is published in Sanity (instant, via the webhook below),
  - otherwise every 10 minutes as a safety net.
- Listings: see [FEEDSYNC_SYNC.md](FEEDSYNC_SYNC.md). Agentbox is the source of truth for
  listing details; SEO fields on listings stay editable in Sanity.

## Local development

Requires Node.js 20.9+.

```bash
cp .env.example .env.local    # fill in values
npm install
npm run dev                   # website on http://localhost:3000
npm run dev:studio            # Studio on http://localhost:3333/studio
```

## Deploy (Vercel)

Push to `master`. Vercel runs `npm run build` (builds the Studio into `public/studio`, then
`next build`). Set the environment variables from `.env.example` in Vercel.

### Sanity webhook (instant updates)

sanity.io/manage → project `edbqqkej` → API → Webhooks → Create:

- URL: `https://<domain>/api/revalidate`
- Trigger on: Create, Update, Delete · Dataset: `production`
- HTTP header: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`

Also add the website domain under API → CORS origins (needed for /studio).

## Commands

```bash
npm run dev          # website
npm run dev:studio   # Studio
npm run build        # Studio + website production build
npm run typecheck    # TypeScript
npm test             # REAXML parser test
```
