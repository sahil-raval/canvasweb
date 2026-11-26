/**
 * /llms.txt — a plain-text summary of the agency and its current listings for AI
 * assistants (ChatGPT, Perplexity, Claude, Gemini). Built from the same live content.
 */
import {isSold} from '@/lib/cms/listing'
import {SITE_URL} from '@/lib/cms/config'
import {getContent} from '@/lib/cms/fetch'
import {googleRating} from '@/lib/cms/reviews'

export const revalidate = 600

export async function GET() {
  const c = await getContent()
  const s = c.siteSettings
  const base = (s.siteUrl || SITE_URL).replace(/\/+$/, '')
  const current = c.listings.filter((l) => !isSold(l.status))
  const sold = c.listings.filter((l) => isSold(l.status))
  const line = (l: (typeof c.listings)[number]) =>
    `- [${l.address}, ${l.suburb} ${l.state}](${base}/listings/${l.slug}): ${[
      l.type,
      ...(l.type === 'Land' ? [] : [`${l.beds} bed`, `${l.baths} bath`, `${l.cars} car`]),
      l.land,
    ]
      .filter(Boolean)
      .join(', ')}. ${l.price}.`

  const text = [
    `# ${s.businessName}`,
    '',
    `> ${s.tagline}`,
    '',
    `${s.businessName} is an independent real estate agency based in ${s.location || 'Geelong, Victoria'}. ${s.serviceArea || ''}`.trim(),
    '',
    ...(() => {
      const answers = c.pages.filter((p) => p.seo?.answerSummary && !p.seo?.excludeFromLlms && !p.seo?.noIndex)
      if (!answers.length) return []
      return ['## Key facts', ...answers.map((p) => `- ${p.title}: ${p.seo!.answerSummary}${p.seo?.keyTakeaways?.length ? ` (${p.seo.keyTakeaways.join('; ')})` : ''}`), '']
    })(),
    '## Contact',
    s.phone ? `- Phone: ${s.phone}` : '',
    s.email ? `- Email: ${s.email}` : '',
    s.weekdayHours ? `- Hours: ${s.weekdayHours}${s.weekendHours ? `; ${s.weekendHours}` : ''}` : '',
    `- Website: ${base}`,
    '',
    ...(() => {
      const r = googleRating(s)
      const quotes = c.reviews.slice(0, 5)
      if (!r && !quotes.length) return []
      return [
        '## Client reviews',
        ...(r ? [`- Google rating: ${r.rating.toFixed(1)}/5${r.count ? ` from ${r.count} reviews` : ''}${r.readUrl ? ` (${r.readUrl})` : ''}`] : []),
        ...quotes.map((q) => `- "${q.text.replace(/\s+/g, ' ').slice(0, 280)}" - ${q.authorName}${q.suburb ? `, ${q.suburb}` : ''}${q.source ? ` (${q.source})` : ''}`),
        '',
      ]
    })(),
    '## Agents',
    ...c.agents.map((a) => `- ${a.name}${a.role ? `, ${a.role}` : ''}${a.phone ? ` (${a.phone})` : ''}`),
    '',
    '## Property for sale',
    ...(current.length ? current.map(line) : ['- No properties listed right now.']),
    '',
    '## Recently sold',
    ...sold.map(line),
    '',
    '## Pages',
    `- [Property for sale](${base}/listings)`,
    `- [Sold properties](${base}/sold)`,
    `- [Rentals](${base}/rent)`,
    `- [About us](${base}/about)`,
    `- [Contact and appraisals](${base}/contact)`,
    `- [Journal: Geelong property insights](${base}/journal)`,
    ...(c.suburbs.length ? [`- [Suburb guides](${base}/suburbs)`] : []),
    ...c.landingPages
      .filter((p) => !p.seo?.noIndex && !p.seo?.excludeFromLlms)
      .map((p) => `- [${p.sections.find((x) => x._type === 'lpHero')?.heading || p.title}](${base}/${p.slug})${p.seo?.answerSummary ? `: ${p.seo.answerSummary}` : ''}`),
    ...c.suburbs
      .filter((x) => !x.seo?.excludeFromLlms)
      .map((x) => `  - [${x.name}](${base}/suburbs/${x.slug})${x.seo?.answerSummary || x.intro ? `: ${x.seo?.answerSummary || x.intro}` : ''}`),
    ...c.articles.slice(0, 20).map((a) => `  - [${a.title}](${base}/journal/${a.slug}): ${a.excerpt}`),
    '',
  ]
    .filter((x, i, arr) => !(x === '' && arr[i - 1] === ''))
    .join('\n')

  return new Response(text, {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}
