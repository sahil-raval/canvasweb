/** Content types. Listings come from Agentbox (via the FeedSync sync), everything else from Sanity. */

export interface ComparableSale {
  address: string;
  suburb: string;
  saleDate: string;
  salePrice: string;
  beds: number;
  baths: number;
  land: string;
}

export interface StatementOfInformation {
  method: "Private Sale" | "Auction";
  indicativeRange: string;
  comparableSales: ComparableSale[];
}

export interface Listing {
  _updatedAt?: string;
  slug: string;
  address: string;
  suburb: string;
  state: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  land: string;
  type: string;
  status: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  features: string[];
  agent: string;
  agents?: string[];
  soi?: StatementOfInformation | null;
  statementOfInformationPdf?: string;
  floorPlanImage?: string;
  floorPlanPdf?: string;
}

export interface Rental {
  _updatedAt?: string;
  slug: string;
  address: string;
  suburb: string;
  state: string;
  rentPw: string;
  bond: string;
  available: string;
  leaseLength: string;
  beds: number;
  baths: number;
  cars: number;
  land: string;
  type: string;
  furnished: boolean;
  petsConsidered: boolean;
  heroImage: string;
  gallery: string[];
  description: string[];
  features: string[];
  agent: string;
}

export type BlockType =
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string }
  | { type: "heading"; text: string }
  | { type: "divider" };


export interface Article {
  _updatedAt?: string;
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: BlockType[];
  author: string;
  date: string;
  readTime: number;
  image: string;
  featured: boolean;
}

export interface SeoFields {
  // Google search
  title?: string;
  description?: string;
  focusKeyword?: string;
  keywords?: string[];
  schemaType?: string;
  // Answer engines
  answerSummary?: string;
  keyTakeaways?: string[];
  speakable?: boolean;
  // AI search
  aboutEntities?: Array<{ name: string; url?: string }>;
  sources?: Array<{ title: string; url: string }>;
  reviewedBy?: { name: string; role?: string; key?: string } | null;
  lastReviewed?: string;
  excludeFromLlms?: boolean;
  // Social
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: "summary" | "summary_large_image";
  // Indexing
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  sitemapPriority?: number;
}

export interface BusinessAddress {
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteSettings {
  businessName: string;
  siteUrl: string;
  tagline: string;
  phone?: string;
  email?: string;
  location?: string;
  serviceArea?: string;
  weekdayHours?: string;
  weekendHours?: string;
  address?: BusinessAddress | null;
  googleBusinessProfileUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  googleReviewsUrl?: string;
  googleWriteReviewUrl?: string;
  licenceNumber?: string;
  abn?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  defaultSeo?: SeoFields;
}

export type CmsListing = Listing & { seo?: SeoFields };
export type CmsRental = Rental & { seo?: SeoFields };
export type CmsArticle = Article & { seo?: SeoFields };
export interface CmsAgent {
  key: string;
  name: string;
  role?: string;
  bio?: string;
  phone?: string;
  email?: string;
  photo?: string;
  seo?: SeoFields;
}
export interface CmsPage {
  title?: string;
  slug: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  heroImage?: string;
  ctaLabel?: string;
  ctaHref?: string;
  _updatedAt?: string;
  faqs?: Faq[] | null;
  body?: CmsSuburb["body"];
  seo?: SeoFields;
  aboutContent?: {
    manifestoEyebrow?: string; manifesto?: string; manifestoCaption?: string; manifestoHint?: string;
    marqueeItems?: string[]; valuesEyebrow?: string; valuesHeading?: string;
    values?: Array<{number?: string; label?: string; title?: string; description?: string; image?: string}>;
    galleryEyebrow?: string; galleryHeading?: string; galleryIntro?: string;
    gallery?: Array<{image?: string; alt?: string}>;
    cta?: PageCta;
    agentPanels?: Array<{agent?: CmsAgent; number?: string; flip?: boolean; image?: string; bio?: string[]}>;
  };
  homeContent?: {
    heroPrimaryLabel?: string; heroPrimaryHref?: string; heroSecondaryLabel?: string; heroSecondaryHref?: string;
    featuredEyebrow?: string; featuredHeading?: string; featuredBody?: string; featuredLinkLabel?: string; featuredUrgency?: string;
    processEyebrow?: string; processHeading?: string; processBody?: string;
    processSteps?: Array<{number?: string; title?: string; description?: string}>; processCtaLabel?: string; processCtaHref?: string;
    pillarsEyebrow?: string; pillarsHeading?: string; pillars?: Array<{title?: string; description?: string}>;
    teamEyebrow?: string; teamHeading?: string; teamBody?: string; teamPoints?: string[]; teamCtaLabel?: string; teamCtaHref?: string;
    reviewsEyebrow?: string; reviewsHeading?: string;
    contactEyebrow?: string; contactHeading?: string; contactBody?: string; formHeading?: string;
  } | null;
  listingsContent?: {urgencyText?: string; emptyTitle?: string; emptyBody?: string; emptyContactLabel?: string; emptyContactHref?: string; offMarketEyebrow?: string; offMarketHeading?: string; offMarketBody?: string; offMarketLabel?: string; offMarketHref?: string};
  rentContent?: {processEyebrow?: string; processHeading?: string; processSteps?: PageTextItem[]; availableEyebrow?: string; availableHeading?: string; upcomingEyebrow?: string; upcomingHeading?: string; cardCtaLabel?: string; cta?: PageCta};
  contactContent?: {trustPoints?: Array<{icon?: string; text?: string}>; infoHeading?: string; formEyebrow?: string; formHeading?: string; reachOutEyebrow?: string; reachOutHeading?: string; reachOutCards?: PageTextItem[]};
  journalContent?: {categories?: string[]; tickerItems?: string[]; featuredLabel?: string; emptyTitle?: string; emptyBody?: string; filteredEmptyText?: string; exploreEyebrow?: string; exploreHeading?: string; exploreBody?: string; exploreCtaLabel?: string; exploreCtaHref?: string; footerText?: string; footerCtaLabel?: string; footerCtaHref?: string; articleCtaHeading?: string; articleCtaBody?: string; articleCtaLabel?: string};
}
export interface PageTextItem { number?: string; label?: string; title?: string; description?: string; href?: string }
export interface PageCta { eyebrow?: string; heading?: string; body?: string; label?: string; href?: string; perks?: string[] }

export interface CmsSuburb {
  name: string;
  slug: string;
  postcode?: string;
  heading?: string;
  intro?: string;
  heroImage?: string;
  body?: Array<{ _key?: string; type: "paragraph" | "heading" | "pullquote" | "divider"; text?: string }> | null;
  faqs?: Faq[] | null;
  seo?: SeoFields;
  _updatedAt?: string;
}

export interface CmsReview {
  _id: string;
  authorName: string;
  rating: number;
  text: string;
  suburb?: string;
  service?: string;
  source?: string;
  link?: string;
  date?: string;
  featured?: boolean;
  agent?: string;
}

export interface LpCta { label?: string; href?: string }
export interface LpItem { title?: string; description?: string; href?: string; value?: string; label?: string; source?: string; question?: string; answer?: string }
export interface LpSection {
  _key: string;
  _type: "lpHero" | "lpText" | "lpImageText" | "lpCards" | "lpSteps" | "lpStats" | "lpListings" | "lpReviews" | "lpFaq" | "lpCta" | "lpForm";
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  intro?: string;
  /** Rich sections for "Text", plain text for the other section types. */
  body?: string | Array<{ _key?: string; type: "paragraph" | "heading" | "pullquote" | "divider"; text?: string }> | null;
  image?: string;
  imageAlt?: string;
  imageOnRight?: boolean;
  primaryCta?: LpCta | null;
  secondaryCta?: LpCta | null;
  cta?: LpCta | null;
  items?: LpItem[] | null;
  show?: "current" | "sold" | "all";
  suburbs?: string[] | null;
  limit?: number;
  markAsHowTo?: boolean;
}
export interface CmsLandingPage {
  title: string;
  slug: string;
  _updatedAt?: string;
  showInFooter?: boolean;
  sections: LpSection[];
  seo?: SeoFields;
}

export interface CmsContent {
  siteSettings: SiteSettings;
  listings: CmsListing[];
  rentals: CmsRental[];
  articles: CmsArticle[];
  pages: CmsPage[];
  agents: CmsAgent[];
  suburbs: CmsSuburb[];
  reviews: CmsReview[];
  landingPages: CmsLandingPage[];
}
