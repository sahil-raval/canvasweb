import 'server-only'
import {cache} from 'react'
import {CMS_TAG, sanityApiVersion, sanityDataset, sanityProjectId} from './config'
import {CONTENT_QUERY} from './query'
import type {CmsContent, SiteSettings} from './types'

export const defaultSiteSettings: SiteSettings = {
  businessName: 'Canvas Real Estate',
  siteUrl: 'https://canvasrealestate.com.au',
  tagline: 'Independent real estate agents serving Geelong and surrounding suburbs.',
  phone: '0469 131 347',
  email: 'enquiry@canvasrealestate.com.au',
  location: 'East Geelong, Victoria',
  serviceArea: 'Serving all Geelong suburbs',
}

/**
 * Sanity image URLs are served at their full upload size. Ask the Sanity CDN for a
 * modern format (AVIF/WebP) and a sensible maximum width instead.
 */
function optimiseImages<T>(value: T): T {
  if (typeof value === 'string') {
    if (value.startsWith('https://cdn.sanity.io/images/') && !value.includes('?')) {
      return `${value}?auto=format&fit=max&w=2000&q=75` as T
    }
    return value
  }
  if (Array.isArray(value)) return value.map(optimiseImages) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, optimiseImages(v)])) as T
  }
  return value
}

const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])

/**
 * Load all public content. Cached by Next.js and refreshed when the Agentbox sync or a
 * Sanity publish calls revalidateTag('cms'), with a 10-minute safety refresh.
 */
// Uses the live API (not the API CDN) so a refresh right after a sync sees the new data.
export const getContent = cache(async (): Promise<CmsContent> => {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', CONTENT_QUERY)
  url.searchParams.set('perspective', 'published')

  const res = await fetch(url, {next: {tags: [CMS_TAG], revalidate: 600}, headers: {Accept: 'application/json'}})
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const raw = ((await res.json()) as {result?: Record<string, unknown>}).result ?? {}
  const data = optimiseImages(raw)

  return {
    siteSettings: {...defaultSiteSettings, ...((data.siteSettings as SiteSettings | null) ?? {})},
    listings: asArray(data.listings),
    rentals: asArray(data.rentals),
    articles: asArray(data.articles),
    pages: asArray(data.pages),
    agents: asArray(data.agents),
    suburbs: asArray(data.suburbs),
    reviews: asArray(data.reviews),
    landingPages: asArray(data.landingPages),
  }
})
