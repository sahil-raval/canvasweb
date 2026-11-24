/**
 * Turns FeedSync REAXML output into plain listing objects for the website.
 *
 * FeedSync output URL: {FEEDSYNC_URL}?action=do_output&access_key=...&type=residential
 * One <propertyList> with <residential>, <land>, <rental>, ... children.
 */
import {XMLParser} from 'fast-xml-parser'

export type FeedKind = 'listing' | 'rental'

export interface FeedImage {
  url: string
  modTime: string
}

export interface FeedAgent {
  name: string
  email: string
}

export interface FeedProperty {
  kind: FeedKind
  feedType: string // residential, land, rental, ...
  uniqueId: string
  modTime: string
  feedStatus: string // current, sold, leased, withdrawn, offmarket
  hidden: boolean
  address: string
  suburb: string
  state: string
  slug: string
  type: string
  beds: number
  baths: number
  cars: number
  land: string
  headline: string
  description: string[]
  features: string[]
  agents: FeedAgent[]
  images: FeedImage[]
  floorPlan?: FeedImage
  soiPdf?: FeedImage
  // sale
  price?: string
  status?: 'For Sale' | 'Under Offer' | 'Sold'
  // rental
  rentPw?: string
  bond?: string
  available?: string
}

export const LISTING_TYPES = ['residential', 'land', 'rural', 'commercial', 'commercialLand', 'business'] as const
export const RENTAL_TYPES = ['rental', 'holidayRental'] as const

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  textNodeName: '#text',
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  isArray: (name) =>
    ['img', 'floorplan', 'attachment', 'listingAgent', 'telephone', 'extraFields', 'inspection'].includes(name) ||
    [...LISTING_TYPES, ...RENTAL_TYPES].includes(name as never),
})

type Node = Record<string, any> | string | undefined

const text = (n: Node): string => {
  if (n === undefined || n === null) return ''
  if (typeof n === 'string' || typeof n === 'number') return String(n).trim()
  return String(n['#text'] ?? '').trim()
}
const attr = (n: Node, name: string): string =>
  n && typeof n === 'object' ? String(n[`@${name}`] ?? '').trim() : ''
const num = (n: Node): number => {
  const v = Number.parseFloat(text(n))
  return Number.isFinite(v) && v > 0 ? v : 0
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

const money = (v: string) => {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) && n > 0 ? `$${Math.round(n).toLocaleString('en-AU')}` : ''
}

/** Map REAXML category names onto the website's fixed property types. */
const TYPE_MAP: Record<string, string> = {
  house: 'House',
  townhouse: 'Townhouse',
  terrace: 'Townhouse',
  'duplexsemi-detached': 'Townhouse',
  villa: 'Unit',
  unit: 'Unit',
  blockofunits: 'Unit',
  retirement: 'Unit',
  apartment: 'Apartment',
  flat: 'Apartment',
  studio: 'Apartment',
  serviceapartment: 'Apartment',
  acreage: 'Rural',
  'acreagesemi-rural': 'Rural',
  rural: 'Rural',
  land: 'Land',
  residential: 'Land',
}

const mapType = (feedType: string, category: string) => {
  if (feedType === 'land') return 'Land'
  if (feedType === 'rural') return 'Rural'
  return TYPE_MAP[category.toLowerCase().replace(/\s+/g, '')] ?? 'House'
}

/** Count-style feature tags that are already shown as beds / baths / cars. */
const COUNT_FEATURES = new Set([
  'bedrooms', 'bathrooms', 'garages', 'carports', 'openSpaces', 'toilets',
  'livingAreas', 'ensuite', 'remoteGarage', 'secureParking', 'study',
])

const label = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())

const truthy = (v: string) => v !== '' && v !== '0' && v.toLowerCase() !== 'no' && v.toLowerCase() !== 'false'

const collectFeatures = (p: Record<string, any>): string[] => {
  const out: string[] = []
  const groups = [p.features, p.allowances, p.ecoFriendly]
  for (const g of groups) {
    if (!g || typeof g !== 'object') continue
    for (const [key, value] of Object.entries(g)) {
      if (key.startsWith('@') || key === '#text' || COUNT_FEATURES.has(key)) continue
      if (key === 'otherFeatures') {
        text(value as Node)
          .split(/[,;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => out.push(s))
        continue
      }
      const v = typeof value === 'object' ? text(value as Node) || attr(value as Node, 'value') : text(value as Node)
      if (truthy(v)) out.push(label(key))
    }
  }
  return [...new Set(out)].slice(0, 40)
}

const paragraphs = (s: string) =>
  s
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n|\n/)
    .map((x) => x.trim())
    .filter(Boolean)

const extraField = (p: Record<string, any>, name: string) => {
  const f = (p.extraFields ?? []).find((x: Node) => attr(x, 'name') === name)
  return f ? attr(f, 'value') || text(f) : ''
}

const landSize = (p: Record<string, any>) => {
  const area = p.landDetails?.area
  const v = num(area)
  if (!v) return ''
  const unit = attr(area, 'unit').toLowerCase()
  if (unit === 'hectare') return `${v} ha`
  if (unit === 'acre') return `${v} acres`
  if (unit === 'squarefeet') return `${v} sq ft`
  return `${v.toLocaleString('en-AU')} m²`
}

const objectsOf = (p: Record<string, any>, tag: 'img' | 'floorplan'): FeedImage[] =>
  (p.objects?.[tag] ?? [])
    .filter((o: Node) => attr(o, 'url').startsWith('http'))
    .sort((a: Node, b: Node) => {
      // REAXML image ids: "m" is the main image, then a, b, c ...
      const ia = attr(a, 'id')
      const ib = attr(b, 'id')
      if (ia === 'm') return -1
      if (ib === 'm') return 1
      return ia.localeCompare(ib, 'en', {numeric: true})
    })
    .map((o: Node) => ({url: attr(o, 'url'), modTime: attr(o, 'modTime')}))

const mapProperty = (feedType: string, p: Record<string, any>): FeedProperty | null => {
  const uniqueId = text(p.uniqueID)
  if (!uniqueId) return null

  const kind: FeedKind = (RENTAL_TYPES as readonly string[]).includes(feedType) ? 'rental' : 'listing'
  const feedStatus = attr(p, 'status').toLowerCase() || 'current'
  const a = p.address ?? {}
  const streetNumber = [text(a.subNumber), text(a.streetNumber)].filter(Boolean).join('/')
  const address =
    extraField(p, 'streetAddress') ||
    [text(a.lotNumber) && !streetNumber ? `Lot ${text(a.lotNumber)}` : '', streetNumber, text(a.street)]
      .filter(Boolean)
      .join(' ')
  const suburb = text(a.suburb)
  const state = [text(a.state), text(a.postcode)].filter(Boolean).join(' ') || 'VIC'
  const category =
    attr(p.category, 'name') || attr(p.landCategory, 'name') || attr(p.commercialCategory, 'name') || ''

  const f = p.features ?? {}
  const agents: FeedAgent[] = (p.listingAgent ?? [])
    .map((ag: Record<string, any>) => ({name: text(ag.name), email: text(ag.email).toLowerCase()}))
    .filter((ag: FeedAgent) => ag.name || ag.email)

  const soi = (p.media?.attachment ?? []).find(
    (m: Node) => attr(m, 'usage') === 'statementOfInformation' && attr(m, 'url').startsWith('http'),
  )

  const base: FeedProperty = {
    kind,
    feedType,
    uniqueId,
    modTime: attr(p, 'modTime'),
    feedStatus,
    // Off-market listings are still shown, the same as the current WordPress site.
    hidden: extraField(p, 'hiddenListing') === '1',
    address,
    suburb,
    state,
    slug: slugify(`${address} ${suburb}`),
    type: mapType(feedType, category),
    beds: num(f.bedrooms),
    baths: num(f.bathrooms),
    cars: num(f.garages) + num(f.carports) + num(f.openSpaces),
    land: landSize(p),
    headline: text(p.headline),
    description: paragraphs(text(p.description)),
    features: collectFeatures(p),
    agents,
    images: objectsOf(p, 'img').slice(0, 31), // hero + up to 30 gallery images
    floorPlan: objectsOf(p, 'floorplan')[0],
    soiPdf: soi ? {url: attr(soi, 'url'), modTime: attr(soi, 'id')} : undefined,
  }
  if (base.headline && base.description[0] !== base.headline) base.description.unshift(base.headline)
  if (!base.description.length) base.description = [`${address}, ${suburb}`]

  if (kind === 'listing') {
    const priceView = text(p.priceView)
    const showPrice = attr(p.price, 'display') !== 'no'
    if (feedStatus === 'sold') {
      const sold = p.soldDetails?.soldPrice
      const soldShown = attr(sold, 'display') === 'yes' && money(text(sold))
      base.status = 'Sold'
      base.price = soldShown ? `Sold ${money(text(sold))}` : 'Sold'
    } else {
      base.status = attr(p.underOffer, 'value') === 'yes' ? 'Under Offer' : 'For Sale'
      base.price = priceView || (showPrice && money(text(p.price))) || 'Contact Agent'
    }
  } else {
    const rent = p.rent
    const period = attr(rent, 'period').toLowerCase()
    const value = Number.parseFloat(text(rent))
    const weekly =
      Number.isFinite(value) && value > 0
        ? period === 'month' || period === 'monthly'
          ? Math.round((value * 12) / 52)
          : value
        : 0
    base.rentPw = text(p.priceView) || (weekly ? `$${weekly.toLocaleString('en-AU')} pw` : 'Contact Agent')
    base.bond = money(text(p.bond))
    const avail = text(p.dateAvailable).slice(0, 10)
    base.available = /^\d{4}-\d{2}-\d{2}$/.test(avail) ? avail : new Date().toISOString().slice(0, 10)
  }
  return base
}

/** Parse one FeedSync output document (any type). */
export function parseFeed(xml: string): FeedProperty[] {
  const doc = parser.parse(xml)
  const list = doc?.propertyList
  if (!list || typeof list !== 'object') return []
  const out: FeedProperty[] = []
  for (const feedType of [...LISTING_TYPES, ...RENTAL_TYPES]) {
    for (const p of list[feedType] ?? []) {
      const mapped = mapProperty(feedType, p)
      if (mapped) out.push(mapped)
    }
  }
  return out
}

/** Which properties should be live on the website. */
export const isPublishable = (p: FeedProperty) =>
  !p.hidden &&
  (p.kind === 'listing' ? ['current', 'sold'].includes(p.feedStatus) : p.feedStatus === 'current')
