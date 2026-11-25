import type {MetadataRoute} from 'next'
import {SITE_URL} from '@/lib/cms/config'

export default function robots(): MetadataRoute.Robots {
  return {
    // AI search crawlers are allowed on purpose, so the agency can be cited in AI answers.
    rules: [{userAgent: '*', allow: '/', disallow: ['/studio', '/api/']}],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
