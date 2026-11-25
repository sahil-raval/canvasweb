/** Public Sanity settings. The project ID and dataset are not secret. */
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'edbqqkej'
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = '2026-01-01'

/** Cache tag for all website content. Revalidated by the Agentbox sync and the Sanity webhook. */
export const CMS_TAG = 'cms'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://canvasrealestate.com.au').replace(/\/+$/, '')
