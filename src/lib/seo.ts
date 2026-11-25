import type {Metadata} from 'next'
import {SITE_URL} from '@/lib/cms/config'
import type {CmsArticle, CmsContent, CmsListing, CmsRental, SeoFields} from '@/lib/cms/types'

/** Default SEO per route. Any of these can be overridden in Sanity (Page → SEO, or Site settings → Default SEO). */
export const STATIC_SEO: Record<string, {title: string; description: string; keywords: string[]}> = {
  "/": {
    title: "Canvas Real Estate Geelong | Buy, Sell & Rent",
    description:
      "Independent Geelong real estate agents helping clients buy, sell and rent with local expertise, considered marketing and personal service.",
    keywords: [
      "Geelong real estate",
      "real estate agents Geelong",
      "sell property Geelong",
      "Geelong property management",
    ],
  },
  "/listings": {
    title: "Property for Sale Geelong | Canvas Real Estate",
    description:
      "Explore houses and land for sale across Geelong, Lara, Armstrong Creek and surrounding suburbs with Canvas Real Estate.",
    keywords: [
      "property for sale Geelong",
      "houses for sale Geelong",
      "Lara property",
      "Armstrong Creek real estate",
    ],
  },
  "/sold": {
    title: "Sold Properties Geelong | Canvas Real Estate",
    description:
      "Recent property sales by Canvas Real Estate across Geelong, Lara, Armstrong Creek, Tarneit and surrounding suburbs.",
    keywords: [
      "sold properties Geelong",
      "recent sales Geelong",
      "Geelong real estate results",
    ],
  },
  "/rent": {
    title: "Rental Properties Geelong | Canvas Real Estate",
    description:
      "Browse quality rental properties across Geelong and surrounding suburbs, with responsive local support from Canvas Real Estate.",
    keywords: [
      "rentals Geelong",
      "houses for rent Geelong",
      "Geelong property management",
    ],
  },
  "/about": {
    title: "About Canvas Real Estate | Geelong Property Experts",
    description:
      "Meet the independent Geelong real estate team combining local knowledge, transparent advice and considered property marketing.",
    keywords: [
      "Canvas Real Estate",
      "Geelong real estate team",
      "independent real estate agents Geelong",
    ],
  },
  "/contact": {
    title: "Contact Canvas Real Estate | Geelong Agents",
    description:
      "Contact Canvas Real Estate for property sales, appraisals, buying advice and property management across Greater Geelong.",
    keywords: [
      "contact Geelong real estate agent",
      "property appraisal Geelong",
      "sell my home Geelong",
    ],
  },
  "/journal": {
    title: "Geelong Property Insights | Canvas Journal",
    description:
      "Read local property market insights, buyer and seller guides, design perspectives and Geelong lifestyle stories from Canvas Real Estate.",
    keywords: [
      "Geelong property market",
      "real estate insights Geelong",
      "property advice Victoria",
    ],
  },
};

const siteUrlOf = (c: CmsContent) => (c.siteSettings.siteUrl || SITE_URL).replace(/\/+$/, '')
const abs = (base: string, path: string) => (path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`)
const postcodeOf = (state: string) => state.replace(/\D/g, '').slice(0, 4)

interface MetaInput {
  path: string
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  seo?: SeoFields
  noIndex?: boolean
}

/** Build Next.js metadata. Values typed into Sanity SEO fields always win. */
export function buildMetadata(c: CmsContent, m: MetaInput): Metadata {
  const base = siteUrlOf(c)
  const s = m.seo ?? {}
  const title = s.title || m.title
  const description = s.description || m.description
  const canonical = s.canonicalUrl || `${base}${m.path === '/' ? '' : m.path}`
  const image = abs(base, s.ogImage || m.image || '/og-image.svg')
  const noIndex = s.noIndex ?? m.noIndex ?? false
  const socialTitle = s.ogTitle || title
  const socialDescription = s.ogDescription || description
  return {
    title: {absolute: title},
    description,
    keywords: s.keywords?.length ? s.keywords : m.keywords,
    alternates: {canonical},
    robots: noIndex
      ? {index: false, follow: false}
      : {index: true, follow: true, googleBot: {'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1}},
    openGraph: {
      type: m.type ?? 'website',
      locale: 'en_AU',
      siteName: c.siteSettings.businessName,
      url: canonical,
      title: socialTitle,
      description: socialDescription,
      images: [{url: image, alt: socialTitle}],
      ...(m.publishedTime ? {publishedTime: m.publishedTime} : {}),
      ...(m.modifiedTime ? {modifiedTime: m.modifiedTime} : {}),
    },
    twitter: {card: s.twitterCard || 'summary_large_image', title: socialTitle, description: socialDescription, images: [image]},
  }
}

/** Metadata for a fixed route like "/about", using the matching Sanity page's SEO if there is one. */
export function staticPageMetadata(c: CmsContent, path: string): Metadata {
  const meta = STATIC_SEO[path]
  const slug = path === '/' ? 'home' : path.slice(1)
  const page = c.pages.find((p) => p.slug === slug || (path === '/' && p.slug === '/'))
  const seo = page?.seo ?? (path === '/' ? c.siteSettings.defaultSeo : undefined)
  return buildMetadata(c, {path, title: meta.title, description: meta.description, keywords: meta.keywords, image: page?.heroImage, seo})
}

export function listingMetadata(c: CmsContent, l: CmsListing): Metadata {
  const full = `${l.address}, ${l.suburb} ${l.state}`
  const sold = l.status === 'Sold'
  const facts = (l.type === 'Land' ? [l.land] : [`${l.beds} bed`, `${l.baths} bath`, `${l.cars} car`, l.land]).filter(Boolean).join(', ')
  return buildMetadata(c, {
    path: `/listings/${l.slug}`,
    title: `${l.address}, ${l.suburb} | ${sold ? 'Sold' : l.status === 'Under Offer' ? 'Under Offer' : 'For Sale'} | Canvas Real Estate`,
    description: sold
      ? `${l.type} at ${full} sold by Canvas Real Estate. ${facts}.`
      : `${l.type} for sale at ${full}. ${l.price}. ${facts}. Inspect with Canvas Real Estate Geelong.`,
    keywords: [`${l.suburb} property for sale`, `${l.type.toLowerCase()} for sale ${l.suburb}`, `real estate ${l.suburb}`, full],
    image: l.heroImage,
    modifiedTime: l._updatedAt,
    seo: l.seo,
  })
}

export function rentalMetadata(c: CmsContent, r: CmsRental): Metadata {
  const full = `${r.address}, ${r.suburb} ${r.state}`
  return buildMetadata(c, {
    path: `/rent/${r.slug}`,
    title: `${r.address}, ${r.suburb} | For Rent | Canvas Real Estate`,
    description: `${r.type} for rent at ${full} for ${r.rentPw}. ${r.beds} bed, ${r.baths} bath. View availability and apply with Canvas Real Estate.`,
    keywords: [`${r.suburb} rental property`, `${r.type.toLowerCase()} for rent ${r.suburb}`, full],
    image: r.heroImage,
    seo: r.seo,
  })
}

export function articleMetadata(c: CmsContent, a: CmsArticle): Metadata {
  return buildMetadata(c, {
    path: `/journal/${a.slug}`,
    title: `${a.title} | Canvas Journal`,
    description: a.excerpt,
    keywords: [a.category, 'Geelong property', 'Geelong real estate advice'],
    image: a.image,
    type: 'article',
    publishedTime: a.date,
    modifiedTime: a._updatedAt,
    seo: a.seo,
  })
}

/* ── Structured data (schema.org JSON-LD) ─────────────────────────── */

type Json = Record<string, unknown>

export function businessSchema(c: CmsContent): Json {
  const base = siteUrlOf(c)
  const s = c.siteSettings
  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${base}/#business`,
    name: s.businessName,
    description: s.tagline,
    url: base,
    logo: `${base}/images/logo-dark.png`,
    image: `${base}/og-image.svg`,
    telephone: s.phone,
    email: s.email,
    priceRange: '$$',
    address: {'@type': 'PostalAddress', addressLocality: 'East Geelong', addressRegion: 'VIC', postalCode: '3219', addressCountry: 'AU'},
    // Greater Geelong plus every suburb the agency has listed or sold in (from Agentbox).
    areaServed: ['Greater Geelong', ...new Set(c.listings.map((l) => l.suburb).filter(Boolean))].map((name) => ({
      '@type': 'Place',
      name,
    })),
    employee: c.agents.map((a) => ({'@type': 'Person', name: a.name, jobTitle: a.role, telephone: a.phone, email: a.email})),
    sameAs: s.socialLinks?.map((l) => l.url).filter(Boolean),
  }
}

export function websiteSchema(c: CmsContent): Json {
  const base = siteUrlOf(c)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: c.siteSettings.businessName,
    url: base,
    inLanguage: 'en-AU',
    publisher: {'@id': `${base}/#business`},
  }
}

export function breadcrumbSchema(c: CmsContent, items: Array<[string, string]>): Json {
  const base = siteUrlOf(c)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as [string, string], ...items].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${base}${path === '/' ? '' : path}`,
    })),
  }
}

const numericPrice = (s?: string) => {
  const m = (s || '').replace(/,/g, '').match(/\d{5,}/)
  return m ? Number(m[0]) : undefined
}

export function listingSchema(c: CmsContent, l: CmsListing): Json {
  const base = siteUrlOf(c)
  const url = `${base}/listings/${l.slug}`
  const price = numericPrice(l.price)
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: `${l.address}, ${l.suburb}`,
    url,
    description: l.description?.slice(0, 3).join(' '),
    image: [l.heroImage, ...(l.gallery ?? [])].filter(Boolean).slice(0, 10),
    dateModified: l._updatedAt,
    provider: {'@id': `${base}/#business`},
    about: {
      '@type': l.type === 'Land' ? 'Place' : 'SingleFamilyResidence',
      name: `${l.address}, ${l.suburb} ${l.state}`,
      ...(l.type === 'Land' ? {} : {numberOfRooms: l.beds, numberOfBathroomsTotal: l.baths}),
      address: {
        '@type': 'PostalAddress',
        streetAddress: l.address,
        addressLocality: l.suburb,
        addressRegion: 'VIC',
        postalCode: postcodeOf(l.state),
        addressCountry: 'AU',
      },
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AUD',
      ...(price ? {price} : {}),
      description: l.price,
      availability: l.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: {'@id': `${base}/#business`},
    },
  }
}

export function rentalSchema(c: CmsContent, r: CmsRental): Json {
  const base = siteUrlOf(c)
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${r.address}, ${r.suburb}`,
    url: `${base}/rent/${r.slug}`,
    description: r.description?.[0],
    image: [r.heroImage, ...(r.gallery ?? [])].filter(Boolean).slice(0, 10),
    provider: {'@id': `${base}/#business`},
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AUD',
      description: r.rentPw,
      availability: 'https://schema.org/InStock',
      priceSpecification: {'@type': 'UnitPriceSpecification', name: r.rentPw, unitText: 'WEEK'},
    },
  }
}

export function articleSchema(c: CmsContent, a: CmsArticle): Json {
  const base = siteUrlOf(c)
  const author = c.agents.find((x) => x.key === a.author)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    image: a.image,
    datePublished: a.date,
    dateModified: a._updatedAt || a.date,
    author: {'@type': 'Person', name: author?.name ?? 'Canvas Real Estate', jobTitle: author?.role},
    publisher: {'@id': `${base}/#business`},
    mainEntityOfPage: `${base}/journal/${a.slug}`,
    inLanguage: 'en-AU',
  }
}

export function itemListSchema(c: CmsContent, name: string, items: CmsListing[]): Json {
  const base = siteUrlOf(c)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((l, i) => ({'@type': 'ListItem', position: i + 1, url: `${base}/listings/${l.slug}`, name: `${l.address}, ${l.suburb}`})),
  }
}
