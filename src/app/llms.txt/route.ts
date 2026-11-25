/**
 * /llms.txt — a plain-text summary of the agency and its current listings for AI
 * assistants (ChatGPT, Perplexity, Claude, Gemini). Built from the same live content.
 */
import {isSold} from '@/lib/cms/listing'
import {SITE_URL} from '@/lib/cms/config'
import {getContent} from '@/lib/cms/fetch'

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
    '## Contact',
    s.phone ? `- Phone: ${s.phone}` : '',
    s.email ? `- Email: ${s.email}` : '',
    s.weekdayHours ? `- Hours: ${s.weekdayHours}${s.weekendHours ? `; ${s.weekendHours}` : ''}` : '',
    `- Website: ${base}`,
    '',
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
    ...c.articles.slice(0, 20).map((a) => `  - [${a.title}](${base}/journal/${a.slug}): ${a.excerpt}`),
    '',
  ]
    .filter((x, i, arr) => !(x === '' && arr[i - 1] === ''))
    .join('\n')

  return new Response(text, {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}
