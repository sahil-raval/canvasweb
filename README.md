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
    suburbs/            suburb guide pages
    [slug]/             any other Sanity page (privacy policy, terms …)
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

## Editing content in Sanity

| What | Where in Studio | Shows on |
|---|---|---|
| Business name, phone, email, office address, map location, Google Business Profile link, ABN, licence, social links | Site settings | Header, footer, contact page, search engine data |
| Page headings, text, images, FAQs, SEO | Pages | Matching page (`home`, `listings`, `sold`, `rent`, `about`, `contact`, `journal`) |
| Any other page (e.g. `privacy-policy`, `terms`, `disclaimer`) | Pages → new page with that slug | `/<slug>`; legal pages are linked in the footer automatically |
| Suburb guides | Suburb pages | `/suburbs/<slug>`, with that suburb's Agentbox listings added automatically |
| Journal articles, agents | Journal, Agents | `/journal`, agent cards |
| Client reviews | Reviews (one per review, copied exactly) | Home page review slider, `llms.txt` |
| Google rating, review count, "read" and "leave a review" links | Site settings → Reviews | Rating badges (hidden until filled in), review buttons |
| Listing details | Agentbox (not Sanity) | Listing pages. Only the SEO tab of a listing is edited in Sanity |

**Reviews:** the site shows only the Google rating you type in Site settings, so it never shows an
unchecked number. Update it when it changes. What actually helps local ranking is the number and
freshness of reviews on your Google Business Profile, so use the "Leave a review" link after every sale
or lease. Reviews are not added as schema.org markup, because Google ignores (and may penalise)
review markup a business adds about itself.

**For search and AI answers:** fill in the office address exactly as on Google Business Profile,
add 4-8 real FAQs to the main pages and each suburb page, and write suburb pages with genuine
local knowledge. Thin or copied text does not rank.

## Security

- Secrets are server-only environment variables (never `NEXT_PUBLIC_`). Use 12+ random characters.
- Sync and webhook secrets are compared in constant time; send them as `Authorization: Bearer …` where possible.
- Enquiry API: same-site only, size limit, spam trap, basic rate limit, input validation and escaped emails.
- Headers: HSTS, Content-Security-Policy (no third-party scripts), frame, referrer and permissions policies.
- `npm audit` still lists issues inside Sanity's build tools (CLI). They run only at build time, not on the website.

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
