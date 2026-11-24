/**
 * GET /api/feedsync-sync?key=SYNC_SECRET
 *
 * "Step 3" of the listing update: copies listings from FeedSync into Sanity so the
 * website shows them. Open the link in a browser after running FeedSync.
 *
 * Options:
 *   &dry=1    show what would change, write nothing
 *   &force=1  re-write every listing even if it has not changed
 *
 * Also accepts `Authorization: Bearer <CRON_SECRET>` so a Vercel Cron job can call it.
 */
import {runSync, type SyncReport} from './_lib/sync.js'

function authorised(req: Request) {
  const url = new URL(req.url)
  const secrets = [process.env.SYNC_SECRET, process.env.CRON_SECRET].filter(Boolean) as string[]
  if (!secrets.length) return false
  const given = url.searchParams.get('key') || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  return secrets.includes(given)
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!)

function html(r: SyncReport) {
  const list = (title: string, items: string[]) =>
    items.length ? `<h3>${title} (${items.length})</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''
  const headline = !r.ok
    ? 'Sync failed'
    : r.dryRun
      ? 'Preview only - nothing was changed'
      : r.complete
        ? 'Listings are up to date'
        : 'Partly done - please open this link again to finish copying photos'
  return `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Listings sync</title>
<body style="font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;line-height:1.5">
<h2>${esc(headline)}</h2>
<p>Feed: ${Object.entries(r.feedCounts).filter(([, n]) => n).map(([t, n]) => `${t} ${n}`).join(', ') || 'empty'}
 &middot; Photos copied: ${r.uploads} &middot; ${(r.durationMs / 1000).toFixed(1)}s</p>
${list('New on website', r.created)}${list('Updated', r.updated)}${list('No change', r.unchanged)}
${list('Removed from website', r.removed)}${list('Not shown (status)', r.skipped)}${list('Warnings', r.warnings)}
</body>`
}

export async function GET(req: Request) {
  if (!authorised(req)) return new Response('Unauthorised', {status: 401})
  const url = new URL(req.url)
  const wantsHtml = (req.headers.get('accept') || '').includes('text/html')
  try {
    const report = await runSync({
      dryRun: url.searchParams.get('dry') === '1',
      force: url.searchParams.get('force') === '1',
      timeBudgetMs: 240_000,
    })
    return wantsHtml
      ? new Response(html(report), {headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}})
      : Response.json(report, {headers: {'Cache-Control': 'no-store'}})
  } catch (e) {
    const message = (e as Error).message
    console.error('[feedsync-sync]', e)
    return wantsHtml
      ? new Response(`<!doctype html><meta charset="utf-8"><h2>Sync failed</h2><p>${esc(message)}</p><p>Nothing was removed from the website.</p>`, {
          status: 500,
          headers: {'Content-Type': 'text/html; charset=utf-8'},
        })
      : Response.json({ok: false, error: message}, {status: 500})
  }
}
