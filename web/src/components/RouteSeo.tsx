import { useLocation } from "wouter";
import { Seo } from "@/components/Seo";
import { useCms } from "@/lib/cms";

const SITE_URL = "https://canvasrealestate.com.au";

const staticMeta: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "/": {
    title: "Canvas Real Estate Geelong | Buy, Sell & Rent",
    description:
      "Independent Geelong real estate agents helping clients buy, sell and rent with local expertise, considered marketing and personal service.",
    keywords: [
      "Geelong real estate",
      "real estate agents Geelong",
      "sell property Geelong",
      "Geelong property management",
    ],
  },
  "/listings": {
    title: "Property for Sale Geelong | Canvas Real Estate",
    description:
      "Explore houses and land for sale across Geelong, Lara, Armstrong Creek and surrounding suburbs with Canvas Real Estate.",
    keywords: [
      "property for sale Geelong",
      "houses for sale Geelong",
      "Lara property",
      "Armstrong Creek real estate",
    ],
  },
  "/rent": {
    title: "Rental Properties Geelong | Canvas Real Estate",
    description:
      "Browse quality rental properties across Geelong and surrounding suburbs, with responsive local support from Canvas Real Estate.",
    keywords: [
      "rentals Geelong",
      "houses for rent Geelong",
      "Geelong property management",
    ],
  },
  "/about": {
    title: "About Canvas Real Estate | Geelong Property Experts",
    description:
      "Meet the independent Geelong real estate team combining local knowledge, transparent advice and considered property marketing.",
    keywords: [
      "Canvas Real Estate",
      "Geelong real estate team",
      "independent real estate agents Geelong",
    ],
  },
  "/contact": {
    title: "Contact Canvas Real Estate | Geelong Agents",
    description:
      "Contact Canvas Real Estate for property sales, appraisals, buying advice and property management across Greater Geelong.",
    keywords: [
      "contact Geelong real estate agent",
      "property appraisal Geelong",
      "sell my home Geelong",
    ],
  },
  "/journal": {
    title: "Geelong Property Insights | Canvas Journal",
    description:
      "Read local property market insights, buyer and seller guides, design perspectives and Geelong lifestyle stories from Canvas Real Estate.",
    keywords: [
      "Geelong property market",
      "real estate insights Geelong",
      "property advice Victoria",
    ],
  },
};

export function RouteSeo() {
  const [location] = useLocation();
  const { listings, rentals, articles, pages, agents, siteSettings } = useCms();
  const cleanPath = location.split("?")[0].replace(/\/+$/, "") || "/";
  const siteUrl = (siteSettings.siteUrl || SITE_URL).replace(/\/+$/, "");
  const siteName = siteSettings.businessName || "Canvas Real Estate";
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name: siteName,
    url: siteUrl,
    image: `${siteUrl}/og-image.svg`,
    email: siteSettings.email,
    telephone: siteSettings.phone,
    sameAs: siteSettings.socialLinks?.map((item) => item.url),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Geelong",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
    areaServed: siteSettings.serviceArea || "Greater Geelong",
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: "en-AU",
    publisher: { "@id": `${siteUrl}/#business` },
  };

  const listing = cleanPath.startsWith("/listings/")
    ? listings.find((item) => `/listings/${item.slug}` === cleanPath)
    : undefined;
  if (listing) {
    const fullAddress = `${listing.address}, ${listing.suburb} ${listing.state}`;
    const customSeo = listing.seo;
    return (
      <Seo
        {...customSeo}
        siteUrl={siteUrl}
        siteName={siteName}
        path={cleanPath}
        title={customSeo?.title ?? `${listing.address}, ${listing.suburb} | For Sale`}
        description={
          customSeo?.description ??
          `${listing.type} for sale at ${fullAddress}. ${listing.beds} bedrooms, ${listing.baths} bathrooms and ${listing.cars} car spaces. View details with Canvas Real Estate.`
        }
        keywords={
          customSeo?.keywords ?? [
            `${listing.suburb} property for sale`,
            `${listing.type.toLowerCase()} for sale ${listing.suburb}`,
            fullAddress,
          ]
        }
        ogImage={customSeo?.ogImage ?? listing.heroImage}
        jsonLd={[
          businessSchema,
          {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: fullAddress,
            url: `${siteUrl}${cleanPath}`,
            image: [listing.heroImage, ...listing.gallery].filter(Boolean),
            description: listing.description[0],
            address: {
              "@type": "PostalAddress",
              streetAddress: listing.address,
              addressLocality: listing.suburb,
              addressRegion: "VIC",
              postalCode: listing.state.replace(/\D/g, ""),
              addressCountry: "AU",
            },
          },
        ]}
      />
    );
  }

  const rental = cleanPath.startsWith("/rent/")
    ? rentals.find((item) => `/rent/${item.slug}` === cleanPath)
    : undefined;
  if (rental) {
    const fullAddress = `${rental.address}, ${rental.suburb} ${rental.state}`;
    const customSeo = rental.seo;
    return (
      <Seo
        {...customSeo}
        siteUrl={siteUrl}
        siteName={siteName}
        path={cleanPath}
        title={customSeo?.title ?? `${rental.address}, ${rental.suburb} | For Rent`}
        description={
          customSeo?.description ??
          `${rental.type} for rent at ${fullAddress} for ${rental.rentPw}. View availability and apply with Canvas Real Estate.`
        }
        keywords={
          customSeo?.keywords ?? [
            `${rental.suburb} rental property`,
            `${rental.type.toLowerCase()} for rent ${rental.suburb}`,
            fullAddress,
          ]
        }
        ogImage={customSeo?.ogImage ?? rental.heroImage}
        jsonLd={[
          businessSchema,
          {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: fullAddress,
            url: `${siteUrl}${cleanPath}`,
            image: [rental.heroImage, ...rental.gallery].filter(Boolean),
            description: rental.description[0],
            address: {
              "@type": "PostalAddress",
              streetAddress: rental.address,
              addressLocality: rental.suburb,
              addressRegion: "VIC",
              postalCode: rental.state.replace(/\D/g, ""),
              addressCountry: "AU",
            },
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                name: rental.rentPw,
                unitText: "WEEK",
              },
              availability: "https://schema.org/InStock",
            },
          },
        ]}
      />
    );
  }

  const article = cleanPath.startsWith("/journal/")
    ? articles.find((item) => `/journal/${item.slug}` === cleanPath)
    : undefined;
  if (article) {
    const customSeo = article.seo;
    return (
      <Seo
        {...customSeo}
        siteUrl={siteUrl}
        siteName={siteName}
        path={cleanPath}
        type="article"
        title={customSeo?.title ?? `${article.title} | Canvas Journal`}
        description={customSeo?.description ?? article.excerpt}
        keywords={
          customSeo?.keywords ?? [
            article.category,
            "Geelong property",
            "Canvas Real Estate journal",
          ]
        }
        ogImage={customSeo?.ogImage ?? article.image}
        publishedTime={article.date}
        jsonLd={[
          businessSchema,
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.date,
            author: {
              "@type": "Person",
              name:
                agents.find((agent) => agent.key === article.author)?.name ??
                (article.author === "pooja" ? "Pooja Patel" : "Chandra Bhatt"),
            },
            publisher: { "@id": `${siteUrl}/#business` },
            mainEntityOfPage: `${siteUrl}${cleanPath}`,
          },
        ]}
      />
    );
  }

  const meta = staticMeta[cleanPath];
  if (meta) {
    const pageSeo = pages.find((page) => {
      const pagePath = `/${page.slug}`.replace(/\/+$/, "") || "/";
      return pagePath === cleanPath;
    })?.seo;
    const customSeo =
      pageSeo ?? (cleanPath === "/" ? siteSettings.defaultSeo : undefined);
    return (
      <Seo
        path={cleanPath}
        siteUrl={siteUrl}
        siteName={siteName}
        {...customSeo}
        title={customSeo?.title ?? meta.title}
        description={customSeo?.description ?? meta.description}
        keywords={customSeo?.keywords ?? meta.keywords}
        jsonLd={[businessSchema, websiteSchema]}
      />
    );
  }

  return (
    <Seo
      path={cleanPath}
      siteUrl={siteUrl}
      siteName={siteName}
      title="Page Not Found | Canvas Real Estate"
      description="The requested page could not be found."
      noIndex
      jsonLd={businessSchema}
    />
  );
}