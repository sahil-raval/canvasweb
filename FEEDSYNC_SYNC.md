# Agentbox listings on the new website (FeedSync sync)

## How it works

```
Agentbox (CRM)  ->  XML files  ->  FeedSync  ->  /api/feedsync-sync  ->  Sanity  ->  website
```

- Agentbox is **not** changed or called. We only read FeedSync, the same way the
  WordPress import does today.
- `/api/feedsync-sync` reads every FeedSync output type (residential, land, rural,
  commercial, rental, ...), and creates or updates the matching **Sale listing** or
  **Rental** in Sanity. The website already reads listings from Sanity, so they show
  up within about 15 seconds.
- Photos, the floor plan and the Statement of Information PDF are copied from the
  Agentbox CDN into Sanity, so the website does not depend on Agentbox image links.

## Updating listings (3 steps)

1. Run `https://canvasrealestate.com.au/duplicate-xml.php` (same as today).
2. Open FeedSync and click **Process Feed** (same as today).
3. Open the sync link (this replaces the WordPress "Run Import"):

   `https://<website-domain>/api/feedsync-sync?key=<SYNC_SECRET>`

   The page shows what was added, updated and removed.
   If it says *Partly done*, open the link again. This only happens on the first run
   when many photos need copying.

Useful extras:

- `&dry=1` shows what would change without changing anything. Use this first.
- `&force=1` rewrites every listing, even if Agentbox has not changed it.

## Rules the sync follows

| Agentbox / FeedSync status | Website |
|---|---|
| current | Shown on **Buy** (`/listings`) as "For Sale", or "Under Offer" if under offer is set |
| sold | Moves to the **Sold** page (`/sold`), shown as "Sold" (with the sold price if it is set to display) |
| withdrawn, leased, or "hidden" in Agentbox | Removed from the website |
| off market | Still shown (same as the current WordPress site) |

- Listings are matched by their Agentbox unique ID (for example `1P0012`).
- Every time Agentbox changes a listing, all of these fields are refreshed: address,
  price, status, bedrooms, bathrooms, car spaces (garages + carports + open spaces, the
  same as WordPress), land size, photos (in Agentbox order), description, features,
  agents, floor plan image and Statement of Information PDF. If Agentbox removes the
  floor plan or SOI, it is removed from the website too.
- The website re-reads Sanity every 15 seconds, so changes appear without a rebuild.
- **First run:** if a hand-made listing in Sanity has the same address (URL slug), the
  sync takes it over instead of making a duplicate. From then on, Agentbox controls the
  address, details, price, status, photos, description, features and agents.
- Fields that Agentbox does not send are never touched: SEO, the Statement of
  Information details (method, range, comparable sales), and Floor Plan PDF.
- Hand-made listings that are not in Agentbox are never deleted.
- Agents are matched to the Sanity **Agent** documents by email, then by name.
  If an agent is missing in Sanity, the sync shows a warning. Add the agent in Studio.
- Safety: if FeedSync fails or returns nothing at all, nothing is removed.
- In Studio, synced listings have an **Agentbox** tab showing the Agentbox ID and the
  last sync time. Edit synced details in Agentbox, because the next sync overwrites them.

## One-time setup (Vercel)

Add these **Environment Variables** in the Vercel project (Production). Never give them a
`VITE_` prefix, because that would expose them in the browser.

| Name | Value |
|---|---|
| `FEEDSYNC_URL` | `https://canvasrealestate.com.au/XML/feedsync/` (see "Domain move" below) |
| `FEEDSYNC_ACCESS_KEY` | The FeedSync access key (the same one used in the WordPress import URLs) |
| `SANITY_WRITE_TOKEN` | Sanity token with **Editor** rights: sanity.io/manage → project `edbqqkej` → API → Tokens → Add API token |
| `SYNC_SECRET` | A long random password, used in the sync link |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | Optional. Defaults are `edbqqkej` / `production` |

Then redeploy. Test with `&dry=1` first.

### Run step 3 automatically (recommended)

`.github/workflows/feedsync-sync.yml` opens the sync link every 15 minutes, using
GitHub Actions (free). It does nothing until you add the secret:

GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**

- Name: `FEEDSYNC_SYNC_URL`
- Value: `https://<website-domain>/api/feedsync-sync?key=<SYNC_SECRET>`

Then the only manual steps are 1 and 2 (duplicate-xml and FeedSync Process Feed).
Listings reach the website within 15 minutes. You can also run it straight away from
GitHub → **Actions → Sync Agentbox listings → Run workflow**. Unchanged runs take about
2 seconds and copy nothing.

## Domain move

FeedSync lives on the current WordPress hosting at `/XML/feedsync/`. When
`canvasrealestate.com.au` is pointed to the new website, that path will stop working.
Before the switch:

1. Move FeedSync to a sub-domain on the current hosting, for example
   `feeds.canvasrealestate.com.au/XML/feedsync/`.
2. Update the `duplicate-xml.php` script and the Agentbox FTP destination if they use
   the old path. Ask Agentbox support to change the FTP destination. Do not change
   anything else in Agentbox.
3. Change `FEEDSYNC_URL` in Vercel to the new address.

## Developer notes

- Code: `api/feedsync-sync.ts` (route), `api/_lib/reaxml.ts` (REAXML parser),
  `api/_lib/sync.ts` (sync rules), `api/_lib/sanity.ts` (Sanity HTTP client).
- Checks: `npm run test:feed` (parser test) and `npm run typecheck:api`.
- The function may run for up to 300 seconds (`vercel.json` → `functions`). It stops
  starting new photo uploads after 240 seconds and reports *Partly done*.
