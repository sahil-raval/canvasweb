import type {CmsContent} from './types'

/**
 * Each page sends the browser only the content it uses, instead of every listing,
 * article and page on every route. Keeps HTML small as the number of listings grows.
 */
export function scope(c: CmsContent, part: Partial<Omit<CmsContent, 'siteSettings'>>): CmsContent {
  return {siteSettings: c.siteSettings, listings: [], rentals: [], articles: [], pages: [], agents: [], suburbs: [], reviews: [], landingPages: [], ...part}
}

/** What the header and footer need on every page. */
export function shellContent(c: CmsContent): CmsContent {
  return scope(c, {
    pages: c.pages.map((p) => ({slug: p.slug, title: p.title})),
    suburbs: c.suburbs.map((s) => ({name: s.name, slug: s.slug})),
    landingPages: c.landingPages.filter((l) => l.showInFooter).map((l) => ({title: l.title, slug: l.slug, sections: [], showInFooter: true})),
  })
}

export const pagesFor = (c: CmsContent, ...slugs: string[]) => c.pages.filter((p) => slugs.includes(p.slug))
