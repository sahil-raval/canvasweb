import type {Metadata} from 'next'
import {SITE_URL} from '@/lib/cms/config'
import type {CmsArticle, CmsContent, CmsLandingPage, CmsListing, CmsRental, CmsSuburb, Faq, LpSection, SeoFields} from '@/lib/cms/types'

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
  "/suburbs": {
    title: "Geelong Suburbs We Cover | Canvas Real Estate",
    description:
      "Local real estate knowledge for Geelong suburbs: property types, lifestyle and current listings from Canvas Real Estate.",
    keywords: ["Geelong suburbs", "real estate agents Geelong suburbs", "Geelong suburb guide"],
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
  const noFollow = s.noFollow ?? false
  const socialTitle = s.ogTitle || title
  const socialDescription = s.ogDescription || description
  return {
    title: {absolute: title},
    description,
    keywords: s.keywords?.length ? s.keywords : m.keywords,
    alternates: {canonical},
    robots: noIndex
      ? {index: false, follow: !noFollow}
      : {index: true, follow: !noFollow, googleBot: {'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1}},
    openGraph: {
      type: m.type ?? 'website',
      locale: 'en_AU',
      siteName: c.siteSettings.businessName,
      url: canonical,
      title: socialTitle,
      description: socialDescription,
      images: [{url: image, alt: s.ogImageAlt || socialTitle}],
      ...(m.publishedTime ? {publishedTime: m.publishedTime} : {}),
      ...(m.modifiedTime ? {modifiedTime: m.modifiedTime} : {}),
    },
    twitter: {card: s.twitterCard || 'summary_large_image', title: socialTitle, description: socialDescription, images: [image]},
  }
}

/** Metadata for a fixed route like "/about", using the matching Sanity page's SEO if there is one. */
export function staticPageMetadata(c: CmsContent, path: string): Metadata {
  const meta = STATIC_SEO[path]
  const page = pageFor(c, path)
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
    // Google shows about 60 characters, so drop the brand suffix on long titles.
    title: a.title.length > 45 ? a.title : `${a.title} | Canvas Journal`,
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
  const a = s.address ?? {}
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
    address: {
      '@type': 'PostalAddress',
      ...(a.street ? {streetAddress: a.street} : {}),
      addressLocality: a.suburb || 'East Geelong',
      addressRegion: a.state || 'VIC',
      postalCode: a.postcode || '3219',
      addressCountry: 'AU',
    },
    ...(a.latitude && a.longitude ? {geo: {'@type': 'GeoCoordinates', latitude: a.latitude, longitude: a.longitude}} : {}),
    ...(s.googleBusinessProfileUrl ? {hasMap: s.googleBusinessProfileUrl} : {}),
    ...(s.abn ? {taxID: s.abn} : {}),
    ...(s.licenceNumber ? {identifier: {'@type': 'PropertyValue', name: 'Estate agent licence', value: s.licenceNumber}} : {}),
    // Greater Geelong, every suburb page, and every suburb the agency has listed or sold in (from Agentbox).
    areaServed: [
      'Greater Geelong',
      ...new Set([...c.suburbs.map((x) => x.name), ...c.listings.map((l) => l.suburb)].filter(Boolean)),
    ].map((name) => ({'@type': 'Place', name})),
    employee: c.agents.map((a) => ({'@type': 'Person', name: a.name, jobTitle: a.role, telephone: a.phone, email: a.email})),
    sameAs: [...(s.socialLinks?.map((l) => l.url) ?? []), s.googleBusinessProfileUrl].filter(Boolean),
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
    // Articles written by the agency (no agent picked) are credited to the business itself.
    author: author ? {'@type': 'Person', name: author.name, jobTitle: author.role} : {'@id': `${base}/#business`},
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

/** FAQPage data. Only used when the questions are also visible on the page. */
export function faqSchema(faqs?: Faq[] | null): Json | null {
  const items = (faqs ?? []).filter((f) => f?.question && f?.answer)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({'@type': 'Question', name: f.question, acceptedAnswer: {'@type': 'Answer', text: f.answer}})),
  }
}

export function suburbMetadata(c: CmsContent, sub: CmsSuburb): Metadata {
  return buildMetadata(c, {
    path: `/suburbs/${sub.slug}`,
    title: `Real Estate Agents ${sub.name}${sub.postcode ? ` ${sub.postcode}` : ''} | Canvas Real Estate`,
    description:
      sub.intro ||
      `Buying, selling or renting in ${sub.name}? Local market knowledge, current listings and recent sales from Canvas Real Estate Geelong.`,
    keywords: [`real estate agents ${sub.name}`, `${sub.name} property for sale`, `sell my house ${sub.name}`, `${sub.name} real estate`],
    image: sub.heroImage,
    modifiedTime: sub._updatedAt,
    seo: sub.seo,
  })
}

export function suburbSchema(c: CmsContent, sub: CmsSuburb): Json {
  const base = siteUrlOf(c)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: sub.heading || `Real estate in ${sub.name}`,
    url: `${base}/suburbs/${sub.slug}`,
    description: sub.intro,
    about: {
      '@type': 'Place',
      name: `${sub.name}, VIC${sub.postcode ? ` ${sub.postcode}` : ''}`,
      address: {'@type': 'PostalAddress', addressLocality: sub.name, addressRegion: 'VIC', postalCode: sub.postcode, addressCountry: 'AU'},
    },
    publisher: {'@id': `${base}/#business`},
    inLanguage: 'en-AU',
  }
}

/** Find the Sanity page document for a fixed route ("/" is the "home" page). */
export const pageFor = (c: CmsContent, path: string) =>
  c.pages.find((p) => p.slug === (path === '/' ? 'home' : path.slice(1)) || (path === '/' && p.slug === '/'))

/* ── Page-level data for answer engines and AI search ──────────────── */

const SCHEMA_TYPES = new Set(['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'FAQPage'])

/**
 * WebPage data built from the SEO, AEO and GEO fields: the short answer (marked as
 * speakable for voice assistants), topics, sources, reviewer and review date.
 * Returns null when none of those fields are filled, so nothing empty is published.
 */
export function webPageSchema(
  c: CmsContent,
  p: {path: string; name: string; description?: string; seo?: SeoFields; image?: string; dateModified?: string; defaultType?: string},
): Json | null {
  const s = p.seo ?? {}
  const hasExtras = s.answerSummary || s.keyTakeaways?.length || s.aboutEntities?.length || s.sources?.length || s.reviewedBy || s.schemaType
  if (!hasExtras) return null
  const base = siteUrlOf(c)
  const url = `${base}${p.path === '/' ? '' : p.path}`
  const type = s.schemaType && SCHEMA_TYPES.has(s.schemaType) ? s.schemaType : p.defaultType || 'WebPage'
  // A service is not a kind of page: describe it as the main thing on a normal web page.
  const service =
    s.schemaType === 'Service'
      ? {
          mainEntity: {
            '@type': 'Service',
            name: s.title || p.name,
            description: s.answerSummary || s.description || p.description,
            serviceType: s.focusKeyword || p.name,
            provider: {'@id': `${base}/#business`},
            areaServed: {'@type': 'Place', name: 'Greater Geelong'},
          },
        }
      : {}
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: s.title || p.name,
    description: s.answerSummary || s.description || p.description,
    inLanguage: 'en-AU',
    isPartOf: {'@id': `${base}/#website`},
    publisher: {'@id': `${base}/#business`},
    ...(p.image ? {primaryImageOfPage: p.image} : {}),
    ...(p.dateModified ? {dateModified: p.dateModified} : {}),
    ...(s.lastReviewed ? {lastReviewed: s.lastReviewed} : {}),
    ...(s.reviewedBy ? {reviewedBy: {'@type': 'Person', name: s.reviewedBy.name, jobTitle: s.reviewedBy.role, worksFor: {'@id': `${base}/#business`}}} : {}),
    ...(s.keyTakeaways?.length ? {abstract: s.keyTakeaways.join(' ')} : {}),
    ...(s.keywords?.length || s.focusKeyword ? {keywords: [s.focusKeyword, ...(s.keywords ?? [])].filter(Boolean).join(', ')} : {}),
    ...(s.aboutEntities?.length
      ? {about: s.aboutEntities.map((e) => ({'@type': 'Thing', name: e.name, ...(e.url ? {sameAs: e.url} : {})}))}
      : {}),
    ...(s.sources?.length ? {citation: s.sources.map((x) => ({'@type': 'CreativeWork', name: x.title, url: x.url}))} : {}),
    ...(s.answerSummary && s.speakable !== false
      ? {speakable: {'@type': 'SpeakableSpecification', cssSelector: ['.answer-summary']}}
      : {}),
    ...service,
  }
}

/** HowTo data for a "Steps" section that is marked as a how-to guide. */
export function howToSchema(name: string, steps: LpSection): Json | null {
  const items = (steps.items ?? []).filter((x) => x.title)
  if (!steps.markAsHowTo || items.length < 2) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: steps.heading || name,
    step: items.map((x, i) => ({'@type': 'HowToStep', position: i + 1, name: x.title, text: x.description || x.title})),
  }
}

export function landingMetadata(c: CmsContent, lp: CmsLandingPage): Metadata {
  const hero = lp.sections.find((x) => x._type === 'lpHero')
  return buildMetadata(c, {
    path: `/${lp.slug}`,
    title: `${hero?.heading || lp.title} | ${c.siteSettings.businessName}`,
    description: lp.seo?.answerSummary || hero?.subheading || `${lp.title} - ${c.siteSettings.businessName}, Geelong.`,
    image: hero?.image,
    modifiedTime: lp._updatedAt,
    seo: lp.seo,
  })
}

/** All structured data for a landing page: WebPage extras, breadcrumbs, FAQs and how-to steps. */
export function landingSchemas(c: CmsContent, lp: CmsLandingPage): Json[] {
  const hero = lp.sections.find((x) => x._type === 'lpHero')
  const name = hero?.heading || lp.title
  const faqs = lp.sections.filter((x) => x._type === 'lpFaq').flatMap((x) => (x.items ?? []).map((i) => ({question: i.question || '', answer: i.answer || ''})))
  return [
    webPageSchema(c, {path: `/${lp.slug}`, name, description: hero?.subheading, seo: lp.seo, image: hero?.image, dateModified: lp._updatedAt}),
    breadcrumbSchema(c, [[name, `/${lp.slug}`]]),
    faqSchema(faqs),
    ...lp.sections.filter((x) => x._type === 'lpSteps').map((x) => howToSchema(name, x)),
  ].filter((x): x is Json => !!x)
}
