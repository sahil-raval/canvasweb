import 'server-only'
import {parse} from 'node-html-parser'
import {COLOURS, clean, decode, htmlToSections, mapCategory, niceSlug, stripBrand, tidySections} from './html'
import {mutate, query, sanityConfig, uploadFromUrl} from '@/lib/agentbox/sanity-write'

/**
 * Copies blog posts from the old WordPress site into Sanity as Journal articles.
 * - Each post becomes `wp-post-<id>` so running it again never makes duplicates.
 * - Posts already in Sanity are left alone (so edits made in Sanity are kept) unless force=true.
 * - The old post URL is saved so old links can redirect to the new /journal/<slug> page.
 */
const WP = process.env.WORDPRESS_URL || 'https://canvasrealestate.com.au'

interface WpPost {
  id: number
  slug: string
  date_gmt: string
  modified_gmt: string
  link: string
  title: {rendered: string}
  excerpt: {rendered: string}
  content: {rendered: string}
  yoast_head_json?: {title?: string; description?: string; og_image?: Array<{url?: string}>}
  _embedded?: {
    author?: Array<{name?: string}>
    'wp:featuredmedia'?: Array<{source_url?: string; alt_text?: string}>
    'wp:term'?: Array<Array<{taxonomy: string; name: string}>>
  }
}

export interface ImportReport {
  dryRun: boolean
  found: number
  created: string[]
  updated: string[]
  skipped: string[]
  warnings: string[]
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = []
  for (let page = 1; page <= 20; page++) {
    const url = `${WP}/wp-json/wp/v2/posts?per_page=50&page=${page}&status=publish&_embed=author,wp:featuredmedia,wp:term`
    const res = await fetch(url, {cache: 'no-store', headers: {Accept: 'application/json'}})
    if (res.status === 400 && page > 1) break // past the last page
    if (!res.ok) throw new Error(`WordPress returned ${res.status} for page ${page}`)
    const batch = (await res.json()) as WpPost[]
    posts.push(...batch)
    const totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
    if (page >= totalPages || !batch.length) break
  }
  return posts
}

export async function runWordpressImport({dryRun = false, force = false, show = ''} = {}): Promise<ImportReport> {
  const c = sanityConfig()
  const report: ImportReport = {dryRun, found: 0, created: [], updated: [], skipped: [], warnings: []}
  const posts = await fetchAllPosts()
  report.found = posts.length

  const [existing, agents, taken] = await Promise.all([
    query<Array<{_id: string}>>(c, `*[_id in $ids || _id in $draftIds]{_id}`, {
      ids: posts.map((p) => `wp-post-${p.id}`),
      draftIds: posts.map((p) => `drafts.wp-post-${p.id}`),
    }),
    query<Array<{_id: string; name: string}>>(c, `*[_type == "agent" && !(_id in path("drafts.**"))] | order(name asc){_id, name}`),
    query<Array<{_id: string; slug: string}>>(c, `*[_type == "journalArticle" && !(_id match "wp-post-*") && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`),
  ])
  const have = new Set(existing.map((e) => e._id.replace(/^drafts\./, '')))
  const slugsInUse = new Set(taken.map((t) => t.slug))

  for (const p of posts) {
    const id = `wp-post-${p.id}`
    const title = clean(p.title.rendered)
    if (have.has(id) && !force) { report.skipped.push(`${title} (already in Sanity)`); continue }
    if (slugsInUse.has(niceSlug(p.slug, title))) { report.skipped.push(`${title} (an article with this web address already exists)`); continue }

    const slug = niceSlug(p.slug, title)
    const body = tidySections(htmlToSections(p.content.rendered), title)
    if (!body.length) { report.warnings.push(`${title}: no text found, skipped`); continue }

    const media = p._embedded?.['wp:featuredmedia']?.[0]
    let imageUrl = media?.source_url || parse(p.content.rendered).querySelector('img')?.getAttribute('src') || p.yoast_head_json?.og_image?.[0]?.url
    if (!imageUrl) {
      imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cre-web-sooty.vercel.app'}/images/office-1.jpg`
      report.warnings.push(`${title}: had no image on WordPress - a stock office photo was used, please change it in Sanity`)
    }

    // Only credit a real agent when the WordPress author matches one; otherwise it is by the agency.
    const authorName = (p._embedded?.author?.[0]?.name || '').trim().toLowerCase()
    const agent = authorName ? agents.find((a) => a.name.toLowerCase() === authorName) : undefined
    const terms = (p._embedded?.['wp:term'] || []).flat().filter((t) => t.taxonomy === 'category').map((t) => t.name)
    const category = mapCategory([...terms, title])
    const words = body.reduce((n, s) => n + (s.text?.split(/\s+/).length || 0), 0)
    let excerpt = clean(p.excerpt.rendered).replace(/\s*\[…\]$|\s*\[\.\.\.\]$/, '…')
    if (excerpt.length > 240) excerpt = excerpt.slice(0, 237).replace(/\s+\S*$/, '') + '…'
    const legacyPath = new URL(p.link).pathname

    if (dryRun && (show === p.slug || show === slug)) report.warnings.push(...body.map((b) => `[${b.type}] ${b.text ?? ''}`))
    if (dryRun) { report[have.has(id) ? 'updated' : 'created'].push(`${title} -> /journal/${slug} (${body.length} sections, ${category}, old URL ${legacyPath})`); continue }

    let assetId: string
    try {
      assetId = await uploadFromUrl(c, imageUrl, 'images')
    } catch (e) {
      report.warnings.push(`${title}: image upload failed (${(e as Error).message}), skipped`)
      continue
    }
    const doc = {
      _id: id,
      _type: 'journalArticle',
      title,
      slug: {_type: 'slug', current: slug},
      excerpt,
      image: {_type: 'image', asset: {_type: 'reference', _ref: assetId}},
      body,
      category,
      categoryColor: COLOURS[category],
      ...(agent ? {author: {_type: 'reference', _ref: agent._id}} : {}),
      publishedAt: new Date(p.date_gmt + 'Z').toISOString(),
      readTime: Math.max(1, Math.round(words / 220)),
      featured: false,
      legacyUrl: legacyPath,
      wordpressId: p.id,
      seo: {
        _type: 'seo',
        ...(p.yoast_head_json?.title ? {title: stripBrand(decode(p.yoast_head_json.title)).slice(0, 70)} : {}),
        ...(p.yoast_head_json?.description ? {description: decode(p.yoast_head_json.description).slice(0, 160)} : {}),
      },
    }
    await mutate(c, [have.has(id) ? {createOrReplace: doc} : {createIfNotExists: doc}])
    report[have.has(id) ? 'updated' : 'created'].push(`${title} -> /journal/${slug}`)
  }
  return report
}
