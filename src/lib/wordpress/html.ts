import {createHash} from 'node:crypto'
import {parse, type HTMLElement} from 'node-html-parser'

/** Pure helpers for turning WordPress posts into Sanity article content (no server imports, so they can be unit tested). */
export type Section = {_key: string; type: 'paragraph' | 'heading' | 'pullquote' | 'divider'; text?: string}
const key = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 12)

const ENTITIES: Record<string, string> = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”'}
export function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
}
export const clean = (s: string) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

/** Turn WordPress post HTML into the article sections used in Sanity. */
export function htmlToSections(html: string): Section[] {
  const out: Array<Omit<Section, '_key'>> = []
  const walk = (el: HTMLElement) => {
    for (const node of el.childNodes) {
      if (node.nodeType !== 1) {
        const t = clean(node.rawText || '')
        if (t) out.push({type: 'paragraph', text: t})
        continue
      }
      const e = node as HTMLElement
      const tag = e.tagName?.toLowerCase()
      if (['script', 'style', 'noscript', 'iframe', 'form', 'figure', 'img', 'svg'].includes(tag)) continue
      if (/^h[1-6]$/.test(tag)) { const t = clean(e.innerHTML); if (t) out.push({type: 'heading', text: t}); continue }
      if (tag === 'p') { const t = clean(e.innerHTML); if (t) out.push({type: 'paragraph', text: t}); continue }
      if (tag === 'blockquote') { const t = clean(e.innerHTML); if (t) out.push({type: 'pullquote', text: t}); continue }
      if (tag === 'hr') { out.push({type: 'divider'}); continue }
      if (tag === 'ul' || tag === 'ol') {
        const items = e.querySelectorAll('li').map((li) => clean(li.innerHTML)).filter(Boolean)
        if (items.length) out.push({type: 'paragraph', text: items.map((t, i) => (tag === 'ol' ? `${i + 1}. ` : '• ') + t).join('\n')})
        continue
      }
      if (tag === 'table') {
        const rows = e.querySelectorAll('tr').map((tr) => tr.querySelectorAll('th,td').map((c) => clean(c.innerHTML)).join(' | ')).filter(Boolean)
        if (rows.length) out.push({type: 'paragraph', text: rows.join('\n')})
        continue
      }
      walk(e) // div, section, span wrappers from page builders
    }
  }
  walk(parse(html))
  // Merge repeated text that page builders sometimes print twice, and drop empty dividers at the ends.
  const sections = out.filter((s, i) => !(s.text && out[i - 1]?.text === s.text))
  while (sections[0]?.type === 'divider') sections.shift()
  while (sections.at(-1)?.type === 'divider') sections.pop()
  return sections.map((s, i) => ({_key: key(`${i}${s.type}${s.text || ''}`), ...s}))
}

export const CATEGORIES = ['Market Insights', 'Selling Guide', 'Buying Guide', 'Renting & Investing', 'Lifestyle', 'Design'] as const
export function mapCategory(names: string[]): (typeof CATEGORIES)[number] {
  const all = names.join(' ').toLowerCase()
  if (/market (update|insight)|rba|interest rate|rate rise|budget|price rules|sales rules/.test(all)) return 'Market Insights'
  if (/rent|landlord|tenant|investor|investment|property management/.test(all)) return 'Renting & Investing'
  if (/sell|vendor|listing|campaign|worth|apprais|inspection ready|pre-listing|overpric/.test(all)) return 'Selling Guide'
  if (/buy|first home|loan|mortgage|building/.test(all)) return 'Buying Guide'
  if (/design|interior|styl|renovat/.test(all)) return 'Design'
  if (/lifestyle|suburb|street|famil|community|school|cafe|espresso|easter|moving/.test(all)) return 'Lifestyle'
  return 'Market Insights'
}
export const COLOURS: Record<string, string> = {'Market Insights': '#6b3a52', 'Selling Guide': '#7a4a2e', 'Buying Guide': '#2f5d50', 'Renting & Investing': '#4a5a2e', Lifestyle: '#8a5a2b', Design: '#3d4a6b'}


/** WordPress gave some posts addresses like "blog-13". Make a readable one from the title instead. */
export function niceSlug(slug: string, title: string) {
  if (!/^(blog|post)-?\d*$/i.test(slug)) return slug
  return title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 9).join('-')
}

// Page-builder leftovers that are not part of the article.
const JUNK = /^(share( this)?( post| article)?:?|facebook|twitter|linkedin|pinterest|email|print|read more|previous( post)?|next( post)?|tags?:.*|categor(y|ies):.*|posted (in|by|on).*|leave a (reply|comment)|related posts?)$/i

/** Remove junk lines and a heading that only repeats the article title (the page already shows it). */
export function tidySections<T extends {type: string; text?: string}>(sections: T[], title: string): T[] {
  const norm = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
  return sections.filter((s, i) => {
    if (s.text && JUNK.test(s.text.trim())) return false
    if (i < 3 && s.type === 'heading' && norm(s.text) === norm(title)) return false
    return true
  })
}

/** "Post title - Canvas Real Estate" -> "Post title" (the site adds its own brand). */
export const stripBrand = (t: string) => t.replace(/\s*[-|–—]\s*Canvas Real Estate\s*$/i, '').trim()
