import { useEffect } from "react";
import type { SeoFields } from "@/lib/cms";

const SITE_URL = "https://canvasrealestate.com.au";
interface SeoProps extends SeoFields {
  path: string;
  siteUrl?: string;
  siteName?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([key, value]) => node!.setAttribute(key, value));
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function upsertCanonical(href: string) {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.href = href;
}

export function Seo({
  title = "Canvas Real Estate Geelong | Buy, Sell & Rent",
  description = "Independent Geelong real estate agents delivering considered sales, property management and local market guidance across Greater Geelong.",
  keywords = [
    "Geelong real estate",
    "real estate agents Geelong",
    "property for sale Geelong",
  ],
  canonicalUrl,
  noIndex = false,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = "summary_large_image",
  path,
  siteUrl = SITE_URL,
  siteName = "Canvas Real Estate",
  type = "website",
  publishedTime,
  modifiedTime,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const baseUrl = siteUrl.replace(/\/+$/, "");
    const image = ogImage || `${baseUrl}/og-image.svg`;
    const canonical = canonicalUrl || `${baseUrl}${path === "/" ? "" : path}`;
    const resolvedImage = image.startsWith("http")
      ? image
      : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
    const socialTitle = ogTitle || title;
    const socialDescription = ogDescription || description;

    document.title = title;
    document.documentElement.lang = "en-AU";
    upsertCanonical(canonical);

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: keywords.join(", "),
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    upsertMeta('meta[name="author"]', {
      name: "author",
      content: siteName,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "en_AU",
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: siteName,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: socialTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: socialDescription,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: resolvedImage,
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: socialTitle,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: twitterCard,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: socialTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: socialDescription,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: resolvedImage,
    });

    if (publishedTime) {
      upsertMeta('meta[property="article:published_time"]', {
        property: "article:published_time",
        content: publishedTime,
      });
    } else {
      removeMeta('meta[property="article:published_time"]');
    }

    if (modifiedTime) {
      upsertMeta('meta[property="article:modified_time"]', {
        property: "article:modified_time",
        content: modifiedTime,
      });
    } else {
      removeMeta('meta[property="article:modified_time"]');
    }

    document.head.querySelectorAll('script[data-canvas-jsonld="true"]').forEach((node) => {
      node.remove();
    });

    const schemaItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    schemaItems.forEach((item) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.canvasJsonld = "true";
      script.textContent = JSON.stringify(item).replace(/</g, "\\u003c");
      document.head.appendChild(script);
    });
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    noIndex,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    path,
    siteUrl,
    siteName,
    type,
    publishedTime,
    modifiedTime,
    jsonLd,
  ]);

  return null;
}