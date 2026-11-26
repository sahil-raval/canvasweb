/** Page slugs that have their own designed route. Every other Sanity page is served by /[slug]. */
export const RESERVED_PAGE_SLUGS = new Set(['home', '/', 'listings', 'sold', 'rent', 'about', 'contact', 'journal', 'suburbs', 'studio', 'api'])

/** Legal pages linked from the footer when they exist in Sanity. */
export const LEGAL_PAGES = [
  {slug: 'privacy-policy', label: 'Privacy Policy'},
  {slug: 'terms', label: 'Terms of Use'},
  {slug: 'disclaimer', label: 'Disclaimer'},
]
