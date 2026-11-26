import type {MetadataRoute} from 'next'
import {SITE_URL} from '@/lib/cms/config'
import {getContent} from '@/lib/cms/fetch'
import {RESERVED_PAGE_SLUGS} from '@/lib/cms/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent()
  const base = (c.siteSettings.siteUrl || SITE_URL).replace(/\/+$/, '')
  const pageSeo = (slug: string) => c.pages.find((p) => p.slug === slug)
  const fixed: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1, 'daily'],
    ['/listings', 0.9, 'daily'],
    ['/sold', 0.7, 'weekly'],
    ['/rent', 0.8, 'daily'],
    ['/about', 0.7, 'monthly'],
    ['/contact', 0.7, 'monthly'],
    ['/journal', 0.7, 'weekly'],
    ...(c.suburbs.length ? [['/suburbs', 0.7, 'monthly'] as [string, number, 'monthly']] : []),
  ]
  return [
    ...fixed
      .filter(([path]) => !pageSeo(path === '/' ? 'home' : path.slice(1))?.seo?.noIndex)
      .map(([path, priority, changeFrequency]) => ({
        url: `${base}${path === '/' ? '' : path}`,
        lastModified: pageSeo(path === '/' ? 'home' : path.slice(1))?._updatedAt,
        changeFrequency,
        priority,
      })),
    ...c.listings
      .filter((l) => !l.seo?.noIndex)
      .map((l) => ({
        url: `${base}/listings/${l.slug}`,
        lastModified: l._updatedAt,
        changeFrequency: 'daily' as const,
        priority: l.status === 'Sold' ? 0.5 : 0.9,
        images: [l.heroImage].filter(Boolean),
      })),
    ...c.pages
      .filter((p) => !RESERVED_PAGE_SLUGS.has(p.slug) && !p.seo?.noIndex)
      .map((p) => ({url: `${base}/${p.slug}`, lastModified: p._updatedAt, changeFrequency: 'yearly' as const, priority: 0.3})),
    ...c.suburbs
      .filter((s) => !s.seo?.noIndex)
      .map((s) => ({url: `${base}/suburbs/${s.slug}`, lastModified: s._updatedAt, changeFrequency: 'weekly' as const, priority: 0.8})),
    ...c.rentals
      .filter((r) => !r.seo?.noIndex)
      .map((r) => ({url: `${base}/rent/${r.slug}`, lastModified: r._updatedAt, changeFrequency: 'daily' as const, priority: 0.8})),
    ...c.articles
      .filter((a) => !a.seo?.noIndex)
      .map((a) => ({url: `${base}/journal/${a.slug}`, lastModified: a._updatedAt || a.date, changeFrequency: 'monthly' as const, priority: 0.6})),
  ]
}
