import {createReadStream, existsSync, readFileSync} from 'node:fs'
import {basename, dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import {getCliClient} from 'sanity/cli'

const studioDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const webDir = resolve(studioDir, '../web')
const dataDir = resolve(webDir, 'src/data')
const assetsDir = resolve(webDir, 'src/assets/canvas')
const client = getCliClient({apiVersion: '2026-01-01'}).withConfig({
  perspective: 'raw',
  useCdn: false,
})

function loadWebsiteData(filename) {
  const sourcePath = resolve(dataDir, filename)
  const source = readFileSync(sourcePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: sourcePath,
  }).outputText
  const module = {exports: {}}
  const localRequire = (specifier) => {
    if (specifier.startsWith('@/assets/canvas/')) {
      return resolve(assetsDir, specifier.replace('@/assets/canvas/', ''))
    }
    throw new Error(`Unsupported seed-data import: ${specifier}`)
  }
  vm.runInNewContext(
    `(function (exports, require, module) {${transpiled}\n})`,
    {},
    {filename: sourcePath},
  )(module.exports, localRequire, module)
  return module.exports
}

const {listings} = loadWebsiteData('listings.ts')
const {rentals} = loadWebsiteData('rentals.ts')
const {articles, authors} = loadWebsiteData('journal.ts')
const imageCache = new Map()
const dryRun = process.argv.includes('--dry-run')

if (dryRun) {
  const imagePaths = [
    ...Object.values(authors).map((author) => author.image),
    ...listings.flatMap((listing) => [listing.heroImage, ...listing.gallery]),
    ...rentals.flatMap((rental) => [rental.heroImage, ...rental.gallery]),
    ...articles.map((article) => article.image),
  ]
  const missing = [...new Set(imagePaths)].filter((filePath) => !existsSync(filePath))
  if (missing.length > 0) {
    throw new Error(`Missing seed images:\n${missing.join('\n')}`)
  }
  console.log(
    `Seed dry run passed: ${Object.keys(authors).length} agents, 6 pages, ${listings.length} listings, ${rentals.length} rentals, ${articles.length} articles, and ${new Set(imagePaths).size} image files.`,
  )
  process.exit(0)
}

function key(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function imageObject(assetId) {
  return {_type: 'image', asset: {_type: 'reference', _ref: assetId}}
}

async function uploadImage(filePath) {
  if (imageCache.has(filePath)) return imageCache.get(filePath)
  const filename = basename(filePath)
  let assetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    {filename},
  )
  if (!assetId) {
    process.stdout.write(`Uploading ${filename}... `)
    const asset = await client.assets.upload('image', createReadStream(filePath), {filename})
    assetId = asset._id
    console.log('done')
  }
  imageCache.set(filePath, assetId)
  return assetId
}

async function image(filePath) {
  return imageObject(await uploadImage(filePath))
}

async function gallery(paths = []) {
  return Promise.all(
    paths.map(async (filePath, index) => ({
      ...(await image(filePath)),
      _key: `${index}-${key(basename(filePath))}`,
    })),
  )
}

async function upsertBySourceKey(type, field, value, fields) {
  const existingId = await client.fetch(
    `*[_type == $type && ${field}.current == $value && !(_id in path("drafts.**"))][0]._id`,
    {type, value},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    console.log(`Updated ${type}: ${value}`)
    return existingId
  }
  const created = await client.create({_type: type, ...fields})
  console.log(`Created ${type}: ${value}`)
  return created._id
}

function isoDate(value, fallback = new Date()) {
  if (!value || String(value).toLowerCase() === 'now') {
    return fallback.toISOString().slice(0, 10)
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`Could not parse date: ${value}`)
  }
  return parsed.toISOString().slice(0, 10)
}

function isoDateTime(value) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`Could not parse date: ${value}`)
  }
  return parsed.toISOString()
}

function seo(title, description, keywords = []) {
  return {
    title,
    description,
    keywords,
    twitterCard: 'summary_large_image',
    noIndex: false,
  }
}

console.log('Seeding Canvas Real Estate into Sanity...')

const agentIds = {}
for (const [agentKey, author] of Object.entries(authors)) {
  agentIds[agentKey] = await upsertBySourceKey('agent', 'key', agentKey, {
    key: {_type: 'slug', current: agentKey},
    name: author.name,
    role: author.role,
    bio: author.bio,
    photo: await image(author.image),
    seo: seo(
      `${author.name} | Canvas Real Estate`,
      `${author.name}, ${author.role} at Canvas Real Estate Geelong.`,
      [`${author.name} real estate`, 'Geelong real estate agent'],
    ),
  })
}

const siteSettingsSeed = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  businessName: 'Canvas Real Estate',
  siteUrl: 'https://canvasrealestate.com.au',
  tagline: 'Your story starts here in Geelong.',
  phone: '0469 131 347',
  email: 'enquiry@canvasrealestate.com.au',
  location: 'Geelong, Victoria',
  serviceArea: 'Serving Greater Geelong and surrounding suburbs',
  weekdayHours: 'Mon–Fri: 9am – 6pm',
  weekendHours: 'Sat: 10am – 3pm · Sun: By appointment',
  socialLinks: [],
  defaultSeo: seo(
    'Canvas Real Estate Geelong | Buy, Sell & Rent',
    'Independent Geelong real estate agents delivering considered sales, property management and local market guidance across Greater Geelong.',
    ['Geelong real estate', 'real estate agents Geelong', 'property for sale Geelong'],
  ),
}
await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})
await client
  .patch('siteSettings')
  .set(Object.fromEntries(Object.entries(siteSettingsSeed).filter(([field]) => !field.startsWith('_'))))
  .commit()
console.log('Created or updated site settings')

const pageSeeds = [
  {
    slug: 'home',
    title: 'Home',
    eyebrow: "Geelong's Trusted Independent Agency",
    heading: 'Your Story Starts Here in Geelong.',
    intro:
      'Canvas Real Estate combines deep local expertise with a genuinely personal approach, so you achieve the outcome you deserve.',
    hero: 'geelong-hero.jpg',
    ctaLabel: 'Explore Listings',
    ctaHref: '/listings',
  },
  {
    slug: 'listings',
    title: 'Listings',
    eyebrow: 'Geelong Properties',
    heading: 'Current Listings',
    intro:
      'Expertly curated properties across Geelong and surrounds. Each one hand-selected and professionally presented.',
    hero: 'listing-armstrong1.jpg',
  },
  {
    slug: 'rent',
    title: 'Rent',
    eyebrow: 'Canvas Real Estate',
    heading: 'Rental Properties',
    intro:
      'Quality homes available across Geelong and surrounds — professionally managed and beautifully maintained.',
    hero: 'listing-lara.jpg',
  },
  {
    slug: 'journal',
    title: 'Journal',
    eyebrow: 'Canvas Real Estate',
    heading: 'The Journal',
    intro: 'Perspectives on property, place, and the art of living well.',
    hero: 'office-2.jpg',
  },
  {
    slug: 'about',
    title: 'About',
    eyebrow: 'Canvas Real Estate',
    heading: 'About Us',
    intro:
      'Committed to delivering exceptional property outcomes through honest advice, genuine care, and deep local knowledge.',
    hero: 'office-1.jpg',
  },
  {
    slug: 'contact',
    title: 'Contact',
    eyebrow: "We're Here For You",
    heading: "Let's Start the Conversation",
    intro:
      "Whether you're ready to sell, searching for your perfect home, or simply want to understand what your property is worth. We'd love to hear from you.",
    hero: 'agent-team.jpg',
    ctaLabel: 'Call Us',
    ctaHref: 'tel:0469131347',
  },
]

for (const page of pageSeeds) {
  await upsertBySourceKey('page', 'slug', page.slug, {
    title: page.title,
    slug: {_type: 'slug', current: page.slug},
    eyebrow: page.eyebrow,
    heading: page.heading,
    intro: page.intro,
    heroImage: await image(resolve(assetsDir, page.hero)),
    ...(page.ctaLabel ? {ctaLabel: page.ctaLabel} : {}),
    ...(page.ctaHref ? {ctaHref: page.ctaHref} : {}),
    seo: seo(
      `${page.title === 'Home' ? 'Canvas Real Estate Geelong' : `${page.title} | Canvas Real Estate`}`,
      page.intro,
      [`${page.title.toLowerCase()} Geelong`, 'Canvas Real Estate'],
    ),
  })
}

for (const listing of listings) {
  await upsertBySourceKey('listing', 'slug', listing.slug, {
    address: listing.address,
    suburb: listing.suburb,
    state: listing.state,
    slug: {_type: 'slug', current: listing.slug},
    type: listing.type,
    beds: listing.beds,
    baths: listing.baths,
    cars: listing.cars,
    land: listing.land,
    heroImage: await image(listing.heroImage),
    gallery: await gallery(listing.gallery),
    description: listing.description,
    features: listing.features,
    agent: {_type: 'reference', _ref: agentIds[listing.agent]},
    price: listing.price,
    status: listing.status,
    soi: {
      method: listing.soi.method,
      indicativeRange: listing.soi.indicativeRange,
      comparableSales: listing.soi.comparableSales.map((sale, index) => ({
        _key: `${index}-${key(sale.address)}`,
        address: sale.address,
        suburb: sale.suburb,
        saleDate: isoDate(`1 ${sale.saleDate}`),
        salePrice: sale.salePrice,
        beds: sale.beds,
        baths: sale.baths,
        land: sale.land,
      })),
    },
    seo: seo(
      `${listing.address}, ${listing.suburb} | For Sale`,
      listing.description[0],
      [`property for sale ${listing.suburb}`, `${listing.address} ${listing.suburb}`],
    ),
  })
}

for (const rental of rentals) {
  await upsertBySourceKey('rental', 'slug', rental.slug, {
    address: rental.address,
    suburb: rental.suburb,
    state: rental.state,
    slug: {_type: 'slug', current: rental.slug},
    type: rental.type,
    beds: rental.beds,
    baths: rental.baths,
    cars: rental.cars,
    land: rental.land,
    heroImage: await image(rental.heroImage),
    gallery: await gallery(rental.gallery),
    description: rental.description,
    features: rental.features,
    agent: {_type: 'reference', _ref: agentIds[rental.agent]},
    rentPw: rental.rentPw,
    bond: rental.bond,
    available: isoDate(rental.available),
    leaseLength: rental.leaseLength,
    furnished: rental.furnished,
    petsConsidered: rental.petsConsidered,
    seo: seo(
      `${rental.address}, ${rental.suburb} | For Rent`,
      rental.description[0],
      [`property for rent ${rental.suburb}`, `${rental.address} ${rental.suburb}`],
    ),
  })
}

for (const article of articles) {
  await upsertBySourceKey('journalArticle', 'slug', article.slug, {
    title: article.title,
    slug: {_type: 'slug', current: article.slug},
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    image: await image(article.image),
    body: article.body.map((section, index) => ({
      _key: `${index}-${key(section.type)}`,
      _type: 'articleSection',
      type: section.type,
      ...(section.text ? {text: section.text} : {}),
    })),
    category: article.category,
    categoryColor: article.categoryColor,
    author: {_type: 'reference', _ref: agentIds[article.author]},
    publishedAt: isoDateTime(article.date),
    displayDate: article.date,
    readTime: article.readTime,
    featured: article.featured,
    seo: seo(
      article.title,
      article.excerpt,
      [article.category, 'Geelong property', 'Canvas Real Estate journal'],
    ),
  })
}

console.log(
  `Seed complete: ${Object.keys(agentIds).length} agents, ${pageSeeds.length} pages, ${listings.length} listings, ${rentals.length} rentals, and ${articles.length} articles.`,
)