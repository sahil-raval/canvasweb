/** Every SEO / AEO / GEO field, projected the same way for all document types. */
const SEO = `{
  title, description, focusKeyword, keywords, schemaType,
  answerSummary, keyTakeaways, speakable,
  aboutEntities[]{name, url}, sources[]{title, url},
  "reviewedBy": reviewedBy->{name, role, "key": coalesce(key.current, key)}, lastReviewed, excludeFromLlms,
  ogTitle, ogDescription, "ogImage": ogImage.asset->url, ogImageAlt, twitterCard,
  noIndex, noFollow, canonicalUrl, sitemapPriority
}`

const SECTIONS = `sections[]{
  _key, _type, eyebrow, heading, subheading, intro, show, suburbs, limit, markAsHowTo,
  "body": select(_type == "lpText" => body[]{_key, type, text}, body),
  "image": image.asset->url, imageAlt, imageOnRight,
  primaryCta, secondaryCta, cta,
  "items": items[]{title, description, href, value, label, source, question, answer}
}`

/** One query for all public website content (published documents only). */
export const CONTENT_QUERY = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    businessName,
    siteUrl,
    tagline,
    phone,
    email,
    location,
    serviceArea,
    weekdayHours,
    weekendHours,
    address{street, suburb, state, postcode, latitude, longitude},
    googleBusinessProfileUrl,
    googleRating,
    googleReviewCount,
    googleReviewsUrl,
    googleWriteReviewUrl,
    licenceNumber,
    abn,
    socialLinks[]{platform, url},
    "defaultSeo": defaultSeo${SEO}
  },
  "pages": *[_type == "page" && defined(slug.current)]{
    title,
    "slug": slug.current,
    eyebrow,
    heading,
    intro,
    "heroImage": heroImage.asset->url,
    ctaLabel,
    ctaHref,
    _updatedAt,
    "faqs": faqs[]{question, answer},
    body[]{_key, type, text},
    "seo": seo${SEO},
    "aboutContent": {
      "manifestoEyebrow": aboutContent.manifestoEyebrow,
      "manifesto": aboutContent.manifesto,
      "manifestoCaption": aboutContent.manifestoCaption,
      "manifestoHint": aboutContent.manifestoHint,
      "marqueeItems": aboutContent.marqueeItems,
      "valuesEyebrow": coalesce(aboutValuesEyebrow, aboutContent.valuesEyebrow),
      "valuesHeading": coalesce(aboutValuesHeading, aboutContent.valuesHeading),
      "values": coalesce(
        aboutValues[]{number, title, description, "image": image.asset->url},
        aboutContent.values[]{number, label, title, description, "image": image.asset->url}
      ),
      "galleryEyebrow": aboutContent.galleryEyebrow,
      "galleryHeading": aboutContent.galleryHeading,
      "galleryIntro": aboutContent.galleryIntro,
      "gallery": aboutContent.gallery[]{"image": image.asset->url, alt},
      "cta": aboutContent.cta{eyebrow, heading, body, label, href, perks},
      "agentPanels": aboutContent.agentPanels[]{number, flip, "image": image.asset->url, bio, "agent": agent->{ "key": coalesce(key.current, key), name, role, bio, phone, email, "photo": photo.asset->url }}
    },
    homeContent,
    listingsContent,
    "rentContent": rentContent{processEyebrow, processHeading, processSteps[]{number, label, title, description, href}, availableEyebrow, availableHeading, upcomingEyebrow, upcomingHeading, cardCtaLabel, "cta": cta{eyebrow, heading, body, label, href, perks}},
    "contactContent": contactContent{trustPoints[]{icon, text}, infoHeading, formEyebrow, formHeading, reachOutEyebrow, reachOutHeading, reachOutCards[]{label, title, description, href}},
    "journalContent": journalContent{categories, tickerItems, featuredLabel, emptyTitle, emptyBody, filteredEmptyText, exploreEyebrow, exploreHeading, exploreBody, exploreCtaLabel, exploreCtaHref, footerText, footerCtaLabel, footerCtaHref, articleCtaHeading, articleCtaBody, articleCtaLabel}
  },
  "listings": *[_type == "listing" && defined(slug.current)] | order(_createdAt desc){
    "slug": slug.current, _updatedAt, address, suburb, state, price, beds, baths, cars,
    land, type, status, "heroImage": heroImage.asset->url,
    "gallery": gallery[].asset->url, description, features,
    "agent": coalesce(agent->key.current, agent->key),
    "agents": agents[]->key.current,
    "statementOfInformationPdf": statementOfInformationPdf.asset->url,
    "floorPlanImage": floorPlanImage.asset->url,
    "floorPlanPdf": floorPlanPdf.asset->url,
    soi{method, indicativeRange, comparableSales[]{address, suburb, saleDate, salePrice, beds, baths, land}},
    "seo": seo${SEO}
  },
  "rentals": *[_type == "rental" && defined(slug.current)] | order(_createdAt desc){
    "slug": slug.current, _updatedAt, address, suburb, state, rentPw, bond, available,
    leaseLength, beds, baths, cars, land, type, furnished, petsConsidered,
    "heroImage": heroImage.asset->url, "gallery": gallery[].asset->url,
    description, features, "agent": coalesce(agent->key.current, agent->key),
    "seo": seo${SEO}
  },
  "articles": *[_type == "journalArticle" && defined(slug.current)] | order(publishedAt desc){
    "slug": slug.current, _updatedAt, category, categoryColor, title, subtitle, excerpt,
    body[]{_key, type, text}, "author": coalesce(author->key.current, author->key), "date": coalesce(displayDate, publishedAt),
    readTime, "image": image.asset->url, featured,
    "seo": seo${SEO}
  },
  "agents": *[_type == "agent"] | order(name asc){
    "key": coalesce(key.current, key), name, role, bio, phone, email,
    "photo": photo.asset->url,
    "seo": seo${SEO}
  },
  "reviews": *[_type == "review" && !(_id in path("drafts.**"))] | order(coalesce(date, _createdAt) desc)[0...40]{
    _id, authorName, rating, text, suburb, service, source, link, date, featured,
    "agent": agent->name
  },
  "suburbs": *[_type == "suburb" && defined(slug.current)] | order(name asc){
    name, "slug": slug.current, postcode, heading, intro, _updatedAt,
    "heroImage": heroImage.asset->url,
    body[]{_key, type, text},
    "faqs": faqs[]{question, answer},
    "seo": seo${SEO}
  },
  "landingPages": *[_type == "landingPage" && defined(slug.current) && !(_id in path("drafts.**"))]{
    title, "slug": slug.current, _updatedAt, showInFooter,
    ${SECTIONS},
    "seo": seo${SEO}
  }
}`;
