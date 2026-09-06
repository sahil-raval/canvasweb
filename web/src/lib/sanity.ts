const DEFAULT_API_VERSION = "2026-01-01";

const PUBLIC_CONTENT_QUERY = `{
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
    socialLinks[]{platform, url},
    "defaultSeo": defaultSeo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "pages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    eyebrow,
    heading,
    intro,
    "heroImage": heroImage.asset->url,
    ctaLabel,
    ctaHref,
    _updatedAt,
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "listings": *[_type == "listing" && defined(slug.current)] | order(_createdAt desc){
    "slug": slug.current, address, suburb, state, price, beds, baths, cars,
    land, type, status, "heroImage": heroImage.asset->url,
    "gallery": gallery[].asset->url, description, features, "agent": coalesce(agent->key.current, agent->key),
    soi{method, indicativeRange, comparableSales[]{address, suburb, saleDate, salePrice, beds, baths, land}},
    "seo": seo{
      title, description, keywords, canonicalUrl, noIndex,
      ogTitle, ogDescription, "ogImage": ogImage.asset->url,
      twitterCard, focusKeyword
    }
  },
  "rentals": *[_type == "rental" && defined(slug.current)] | order(_createdAt desc){
    "slug": slug.current, address, suburb, state, rentPw, bond, available,
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
    "slug": slug.current, category, categoryColor, title, subtitle, excerpt,
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
  }
}`;

function getPublicConfig() {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim();
  const dataset = (import.meta.env.VITE_SANITY_DATASET || "production").trim();
  const apiVersion =
    (import.meta.env.VITE_SANITY_API_VERSION || DEFAULT_API_VERSION).trim();

  if (!projectId) return null;
  if (!/^[a-z0-9-]+$/i.test(projectId)) {
    throw new Error("VITE_SANITY_PROJECT_ID contains invalid characters.");
  }
  if (!/^[a-z0-9_-]+$/i.test(dataset)) {
    throw new Error("VITE_SANITY_DATASET contains invalid characters.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) {
    throw new Error("VITE_SANITY_API_VERSION must use YYYY-MM-DD format.");
  }

  return { projectId, dataset, apiVersion };
}

export async function fetchPublicSanityContent() {
  const config = getPublicConfig();
  if (!config) return null;

  const endpoint = new URL(
    `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`,
  );
  endpoint.searchParams.set("query", PUBLIC_CONTENT_QUERY);
  endpoint.searchParams.set("perspective", "published");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Sanity public query failed with ${response.status}`);
    }
    const payload = (await response.json()) as {
      result?: Record<string, unknown>;
    };
    return payload.result ?? null;
  } finally {
    window.clearTimeout(timeout);
  }
}