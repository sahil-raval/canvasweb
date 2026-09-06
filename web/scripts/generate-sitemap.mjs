import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectId =
  process.env.VITE_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "edbqqkej";
const dataset =
  process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
const apiVersion =
  process.env.VITE_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2026-01-01";
const token = process.env.SANITY_READ_TOKEN;
const siteUrl = (
  process.env.SITE_URL || "https://canvasrealestate.com.au"
).replace(/\/+$/, "");

const query = `*[
  _type in ["page", "listing", "rental", "journalArticle"] &&
  defined(slug.current) &&
  seo.noIndex != true
]{
  _type,
  "slug": slug.current,
  _updatedAt
}`;

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/listings", priority: "0.9", changefreq: "daily" },
  { path: "/rent", priority: "0.9", changefreq: "daily" },
  { path: "/journal", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function routeFor(document) {
  const slug = String(document.slug || "").replace(/^\/+|\/+$/g, "");
  if (!slug) return null;
  if (document._type === "listing") return `/listings/${slug}`;
  if (document._type === "rental") return `/rent/${slug}`;
  if (document._type === "journalArticle") return `/journal/${slug}`;
  if (document._type === "page") return slug === "home" ? "/" : `/${slug}`;
  return null;
}

async function loadDocuments() {
  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("perspective", "published");

  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Sanity sitemap query failed with ${response.status}`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload.result)) {
    throw new Error("Sanity sitemap query returned an invalid result.");
  }
  return payload.result;
}

const documents = await loadDocuments();
const routeMap = new Map(staticRoutes.map((route) => [route.path, route]));

for (const document of documents) {
  const path = routeFor(document);
  if (!path || path === "/studio" || path.startsWith("/studio/")) continue;
  routeMap.set(path, {
    path,
    lastmod: document._updatedAt,
    priority: document._type === "page" ? "0.7" : "0.8",
    changefreq: document._type === "journalArticle" ? "weekly" : "daily",
  });
}

const entries = [...routeMap.values()]
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(
    ({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(`${siteUrl}${path === "/" ? "/" : path}`)}</loc>${
      lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

const sitemapPath = resolve("public/sitemap.xml");
await writeFile(sitemapPath, xml);

// Confirm the write is readable and non-empty before reporting success.
const saved = await readFile(sitemapPath, "utf8");
if (!saved.includes("<urlset") || !saved.includes(siteUrl)) {
  throw new Error("Generated sitemap failed validation.");
}

console.log(`Generated sitemap with ${routeMap.size} routes from Sanity.`);