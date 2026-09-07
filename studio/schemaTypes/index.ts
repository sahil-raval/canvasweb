import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

const slugValidation = (rule: any) =>
  rule.required().custom((slug: {current?: string} | undefined) =>
    !slug?.current || /^[a-z0-9-]+$/.test(slug.current)
      ? true
      : 'Use lowercase letters, numbers, and hyphens only',
  )
  

const seo = defineType({
  name: 'seo', title: 'SEO & Social Sharing', type: 'object',
  fields: [
    defineField({name: 'title', title: 'SEO title', type: 'string', description: 'Optional override. Aim for 50–60 characters.', validation: (r) => r.max(60).warning()}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 3, description: 'Optional override. Aim for 150–160 characters.', validation: (r) => r.max(160).warning()}),
    defineField({name: 'focusKeyword', title: 'Focus keyword', type: 'string'}),
    defineField({name: 'keywords', title: 'Related keywords', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}, validation: (r) => r.unique().max(12)}),
    defineField({name: 'canonicalUrl', title: 'Canonical URL override', type: 'url', validation: (r) => r.uri({scheme: ['http', 'https']})}),
    defineField({name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false}),
    defineField({name: 'ogTitle', title: 'Social title override', type: 'string', validation: (r) => r.max(70).warning()}),
    defineField({name: 'ogDescription', title: 'Social description override', type: 'text', rows: 3, validation: (r) => r.max(200).warning()}),
    defineField({name: 'ogImage', title: 'Social image', type: 'image', description: 'Recommended: 1200 × 630px.', options: {hotspot: true}}),
    defineField({name: 'twitterCard', title: 'X / Twitter card', type: 'string', options: {list: [{title: 'Large image', value: 'summary_large_image'}, {title: 'Summary', value: 'summary'}], layout: 'radio'}, initialValue: 'summary_large_image'}),
  ],
})

const comparableSale = defineType({
  name: 'comparableSale', title: 'Comparable sale', type: 'object',
  fields: [
    defineField({name: 'address', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'suburb', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'saleDate', title: 'Sale date', type: 'date'}),
    defineField({name: 'salePrice', title: 'Sale price', type: 'string'}),
    defineField({name: 'beds', title: 'Bedrooms', type: 'number', validation: (r) => r.integer().min(0)}),
    defineField({name: 'baths', title: 'Bathrooms', type: 'number', validation: (r) => r.integer().min(0)}),
    defineField({name: 'land', title: 'Land size', type: 'string'}),
  ],
  preview: {select: {title: 'address', subtitle: 'salePrice'}},
})

const statementOfInformation = defineType({
  name: 'statementOfInformation', title: 'Statement of Information', type: 'object',
  fields: [
    defineField({name: 'method', title: 'Sale method', type: 'string', options: {list: ['Private Sale', 'Auction'], layout: 'radio'}, validation: (r) => r.required()}),
    defineField({name: 'indicativeRange', title: 'Indicative range', type: 'string'}),
    defineField({name: 'comparableSales', title: 'Comparable sales', type: 'array', of: [defineArrayMember({type: 'comparableSale'})], validation: (r) => r.max(3)}),
  ],
})

const agent = defineType({
  name: 'agent', title: 'Agent', type: 'document', icon: UserIcon,
  fields: [
    defineField({name: 'key', title: 'Website key', type: 'slug', description: 'Stable identifier used by the website.', options: {source: 'name'}, validation: slugValidation}),
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', type: 'string'}),
    defineField({name: 'bio', title: 'Biography', type: 'text', rows: 5}),
    defineField({name: 'phone', type: 'string'}),
    defineField({name: 'email', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})

const propertyFields = [
  defineField({name: 'address', title: 'Street address', type: 'string', group: 'details', validation: (r) => r.required()}),
  defineField({name: 'suburb', type: 'string', group: 'details', validation: (r) => r.required()}),
  defineField({name: 'state', title: 'State and postcode', type: 'string', group: 'details', initialValue: 'VIC', validation: (r) => r.required()}),
  defineField({name: 'slug', title: 'URL slug', type: 'slug', group: 'details', options: {source: (doc: any) => `${doc.address || ''}-${doc.suburb || ''}`, maxLength: 96}, validation: slugValidation}),
  defineField({name: 'type', title: 'Property type', type: 'string', group: 'details', options: {list: ['House', 'Townhouse', 'Apartment', 'Unit', 'Land', 'Rural']}, validation: (r) => r.required()}),
  defineField({name: 'beds', title: 'Bedrooms', type: 'number', group: 'details', initialValue: 0, validation: (r) => r.integer().min(0)}),
  defineField({name: 'baths', title: 'Bathrooms', type: 'number', group: 'details', initialValue: 0, validation: (r) => r.integer().min(0)}),
  defineField({name: 'cars', title: 'Car spaces', type: 'number', group: 'details', initialValue: 0, validation: (r) => r.integer().min(0)}),
  defineField({name: 'land', title: 'Land size', type: 'string', group: 'details'}),
  defineField({name: 'heroImage', title: 'Primary image', type: 'image', group: 'media', options: {hotspot: true}, validation: (r) => r.required()}),
  defineField({name: 'gallery', type: 'array', group: 'media', of: [defineArrayMember({type: 'image', options: {hotspot: true}})], validation: (r) => r.max(30)}),
  defineField({name: 'description', title: 'Description paragraphs', type: 'array', group: 'content', of: [defineArrayMember({type: 'text', rows: 5})], validation: (r) => r.required().min(1)}),
  defineField({name: 'features', type: 'array', group: 'content', of: [defineArrayMember({type: 'string'})], validation: (r) => r.unique()}),
  defineField({name: 'agent', type: 'reference', group: 'content', to: [{type: 'agent'}], validation: (r) => r.required()}),
  defineField({name: 'seo', type: 'seo', group: 'seo'}),
]

const listing = defineType({
  name: 'listing', title: 'Sale listing', type: 'document', icon: DocumentIcon,
  groups: [{name: 'details', title: 'Property'}, {name: 'media', title: 'Media'}, {name: 'content', title: 'Marketing'}, {name: 'sale', title: 'Sale'}, {name: 'seo', title: 'SEO'}],
  fields: [
    ...propertyFields,
    defineField({name: 'price', title: 'Price display', type: 'string', group: 'sale', validation: (r) => r.required()}),
    defineField({name: 'status', type: 'string', group: 'sale', options: {list: ['For Sale', 'Under Offer', 'Sold'], layout: 'radio'}, initialValue: 'For Sale', validation: (r) => r.required()}),
    defineField({name: 'soi', title: 'Statement of Information', type: 'statementOfInformation', group: 'sale'}),
  ],
  orderings: [{title: 'Newest first', name: 'createdDesc', by: [{field: '_createdAt', direction: 'desc'}]}],
  preview: {select: {title: 'address', subtitle: 'suburb', media: 'heroImage'}, prepare: ({title, subtitle, media}) => ({title: title || 'Untitled listing', subtitle, media})},
})

const rental = defineType({
  name: 'rental', title: 'Rental', type: 'document', icon: DocumentIcon,
  groups: [{name: 'details', title: 'Property'}, {name: 'media', title: 'Media'}, {name: 'content', title: 'Marketing'}, {name: 'rental', title: 'Rental'}, {name: 'seo', title: 'SEO'}],
  fields: [
    ...propertyFields,
    defineField({name: 'rentPw', title: 'Rent per week', type: 'string', group: 'rental', validation: (r) => r.required()}),
    defineField({name: 'bond', type: 'string', group: 'rental'}),
    defineField({name: 'available', title: 'Available date', type: 'date', group: 'rental', validation: (r) => r.required()}),
    defineField({name: 'leaseLength', title: 'Lease length', type: 'string', group: 'rental'}),
    defineField({name: 'furnished', type: 'boolean', group: 'rental', initialValue: false}),
    defineField({name: 'petsConsidered', title: 'Pets considered', type: 'boolean', group: 'rental', initialValue: false}),
  ],
  preview: {select: {title: 'address', subtitle: 'suburb', media: 'heroImage'}},
})

const articleSection = defineType({
  name: 'articleSection', title: 'Article section', type: 'object',
  fields: [
    defineField({name: 'type', title: 'Section type', type: 'string', options: {list: ['paragraph', 'heading', 'pullquote', 'divider'], layout: 'radio'}, validation: (r) => r.required()}),
    defineField({name: 'text', type: 'text', rows: 7, hidden: ({parent}) => parent?.type === 'divider'}),
  ],
  preview: {select: {title: 'text', subtitle: 'type'}, prepare: ({title, subtitle}) => ({title: title || 'Divider', subtitle})},
})

const journalArticle = defineType({
  name: 'journalArticle', title: 'Journal article', type: 'document', icon: DocumentTextIcon,
  groups: [{name: 'content', title: 'Article', default: true}, {name: 'publishing', title: 'Publishing'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', group: 'content', options: {source: 'title', maxLength: 96}, validation: slugValidation}),
    defineField({name: 'subtitle', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'excerpt', type: 'text', rows: 4, group: 'content', validation: (r) => r.required().max(240)}),
    defineField({name: 'image', title: 'Hero image', type: 'image', group: 'content', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'body', type: 'array', group: 'content', of: [defineArrayMember({type: 'articleSection'})], validation: (r) => r.required().min(1)}),
    defineField({name: 'category', type: 'string', group: 'publishing', options: {list: ['Market Insights', 'Buying Guide', 'Lifestyle', 'Design']}, validation: (r) => r.required()}),
    defineField({name: 'categoryColor', title: 'Category colour', type: 'string', group: 'publishing', initialValue: '#6b3a52'}),
    defineField({name: 'author', type: 'reference', group: 'publishing', to: [{type: 'agent'}], validation: (r) => r.required()}),
    defineField({name: 'publishedAt', type: 'datetime', group: 'publishing', initialValue: () => new Date().toISOString(), validation: (r) => r.required()}),
    defineField({name: 'displayDate', title: 'Display date override', type: 'string', group: 'publishing'}),
    defineField({name: 'readTime', title: 'Read time (minutes)', type: 'number', group: 'publishing', validation: (r) => r.required().integer().positive()}),
    defineField({name: 'featured', type: 'boolean', group: 'publishing', initialValue: false}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})

const page = defineType({
  name: 'page', title: 'Page', type: 'document', icon: DocumentIcon,
  groups: [{name: 'content', title: 'Content', default: true}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'title', title: 'Page title', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Path', type: 'slug', group: 'content', options: {source: 'title'}, validation: slugValidation}),
    defineField({name: 'eyebrow', type: 'string', group: 'content'}),
    defineField({name: 'heading', type: 'string', group: 'content'}),
    defineField({name: 'intro', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'image', group: 'content', options: {hotspot: true}}),
    defineField({name: 'ctaLabel', title: 'Primary action label', type: 'string', group: 'content'}),
    defineField({name: 'ctaHref', title: 'Primary action path', type: 'string', group: 'content'}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
})

const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document', icon: CogIcon,
  groups: [{name: 'business', title: 'Business', default: true}, {name: 'social', title: 'Social'}, {name: 'seo', title: 'SEO'}],
  fields: [
    defineField({name: 'businessName', type: 'string', group: 'business', initialValue: 'Canvas Real Estate', validation: (r) => r.required()}),
    defineField({name: 'siteUrl', title: 'Website URL', type: 'url', group: 'business', initialValue: 'https://canvasrealestate.com.au', validation: (r) => r.required().uri({scheme: ['https']})}),
    defineField({name: 'tagline', type: 'text', rows: 3, group: 'business'}),
    defineField({name: 'phone', title: 'Main phone', type: 'string', group: 'business'}),
    defineField({name: 'email', title: 'Main email', type: 'string', group: 'business', validation: (r) => r.email()}),
    defineField({name: 'location', type: 'string', group: 'business', initialValue: 'Geelong, Victoria'}),
    defineField({name: 'serviceArea', title: 'Service area', type: 'string', group: 'business', initialValue: 'Serving all Geelong suburbs'}),
    defineField({name: 'weekdayHours', title: 'Weekday hours', type: 'string', group: 'business', initialValue: 'Mon–Fri: 9am – 6pm'}),
    defineField({name: 'weekendHours', title: 'Weekend hours', type: 'string', group: 'business', initialValue: 'Sat: 10am – 3pm · Sun: By appt.'}),
    defineField({name: 'socialLinks', title: 'Social links', type: 'array', group: 'social', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'platform', type: 'string', validation: (r) => r.required()}), defineField({name: 'url', type: 'url', validation: (r) => r.required().uri({scheme: ['http', 'https']})})], preview: {select: {title: 'platform', subtitle: 'url'}}})]}),
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Canvas Real Estate settings'})},
})

export const schemaTypes = [seo, comparableSale, statementOfInformation, articleSection, agent, listing, rental, journalArticle, page, siteSettings]
