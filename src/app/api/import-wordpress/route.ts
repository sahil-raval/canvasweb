/**
 * GET /api/import-wordpress?key=SYNC_SECRET
 *
 * Copies the blog posts from the old WordPress site into Sanity (Journal articles).
 *   &dry=1    preview only, nothing changes
 *   &force=1  overwrite articles that were already imported (loses edits made in Sanity)
 * Safe to run more than once: posts already in Sanity are skipped.
 */
import {revalidateTag} from 'next/cache'
import {CMS_TAG} from '@/lib/cms/config'
import {secretFrom, secretMatches} from '@/lib/security'
import {runWordpressImport, type ImportReport} from '@/lib/wordpress/import'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!)

function html(r: ImportReport) {
  const list = (title: string, items: string[]) =>
    items.length ? `<h3>${title} (${items.length})</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''
  return `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">
<title>WordPress blog import</title>
<body style="font-family:system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 16px;line-height:1.5">
<h2>${r.dryRun ? 'Preview only - nothing was changed' : 'Blog import finished'}</h2>
<p>Posts found on WordPress: ${r.found}</p>
${list(r.dryRun ? 'Will be added' : 'Added', r.created)}${list(r.dryRun ? 'Will be overwritten' : 'Overwritten', r.updated)}
${list('Skipped', r.skipped)}${list('Check these', r.warnings)}
</body>`
}

export async function GET(req: Request) {
  if (!secretMatches(secretFrom(req, 'key'), [process.env.SYNC_SECRET])) return new Response('Unauthorised', {status: 401})
  const url = new URL(req.url)
  try {
    const report = await runWordpressImport({dryRun: url.searchParams.get('dry') === '1', force: url.searchParams.get('force') === '1', show: url.searchParams.get('show') || ''})
    if (!report.dryRun && report.created.length + report.updated.length) revalidateTag(CMS_TAG, {expire: 0})
    return (req.headers.get('accept') || '').includes('text/html')
      ? new Response(html(report), {headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}})
      : Response.json(report, {headers: {'Cache-Control': 'no-store'}})
  } catch (e) {
    console.error('[import-wordpress]', e)
    return Response.json({error: (e as Error).message}, {status: 500, headers: {'Cache-Control': 'no-store'}})
  }
}
