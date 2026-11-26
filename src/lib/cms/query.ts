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
    "defaultSeo": defaultSeo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
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
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    },
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
    listingsContent,
    "rentContent": rentContent{processEyebrow, processHeading, processSteps[]{number, label, title, description, href}, availableEyebrow, availableHeading, upcomingEyebrow, upcomingHeading, cardCtaLabel, "cta": cta{eyebrow, heading, body, label, href, perks}},
    "contactContent": contactContent{trustPoints[]{icon, text}, infoHeading, formEyebrow, formHeading, reachOutEyebrow, reachOutHeading, reachOutCards[]{label, title, description, href}},
    "journalContent": journalContent{categories, tickerItems, featuredLabel, emptyTitle, emptyBody, filteredEmptyText, exploreEyebrow, exploreHeading, exploreBody, exploreCtaLabel, exploreCtaHref, footerText, footerCtaLabel, footerCtaHref}
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
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "rentals": *[_type == "rental" && defined(slug.current)] | order(_createdAt desc){
    "slug": slug.current, _updatedAt, address, suburb, state, rentPw, bond, available,
    leaseLength, beds, baths, cars, land, type, furnished, petsConsidered,
    "heroImage": heroImage.asset->url, "gallery": gallery[].asset->url,
    description, features, "agent": coalesce(agent->key.current, agent->key),
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "articles": *[_type == "journalArticle" && defined(slug.current)] | order(publishedAt desc){
    "slug": slug.current, _updatedAt, category, categoryColor, title, subtitle, excerpt,
    body[]{_key, type, text}, "author": coalesce(author->key.current, author->key), "date": coalesce(displayDate, publishedAt),
    readTime, "image": image.asset->url, featured,
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "agents": *[_type == "agent"] | order(name asc){
    "key": coalesce(key.current, key), name, role, bio, phone, email,
    "photo": photo.asset->url,
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
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
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  }
}`;
