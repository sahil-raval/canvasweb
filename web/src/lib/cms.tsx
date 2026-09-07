import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { articles as localArticles, type Article } from "@/data/journal";
import { listings as localListings, type Listing } from "@/data/listings";
import { rentals as localRentals, type Rental } from "@/data/rentals";
import { fetchPublicSanityContent } from "@/lib/sanity";

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
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
  slug: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  heroImage?: string;
  ctaLabel?: string;
  ctaHref?: string;
  _updatedAt?: string;
  seo?: SeoFields;
}

interface CmsPayload {
  siteSettings?: SiteSettings;
  listings?: CmsListing[];
  rentals?: CmsRental[];
  articles?: CmsArticle[];
  pages?: CmsPage[];
  agents?: CmsAgent[];
}

interface CmsContextValue {
  siteSettings: SiteSettings;
  listings: CmsListing[];
  rentals: CmsRental[];
  articles: CmsArticle[];
  pages: CmsPage[];
  agents: CmsAgent[];
  source: "local" | "sanity";
  loading: boolean;
}

const defaultSiteSettings: SiteSettings = {
  businessName: "Canvas Real Estate",
  siteUrl: "https://canvasrealestate.com.au",
  tagline: "Independent real estate agents serving Geelong and surrounding suburbs.",
  phone: "0473 622 865",
  email: "enquiry@canvasrealestate.com.au",
};

const fallbackValue: CmsContextValue = {
  siteSettings: defaultSiteSettings,
  listings: localListings,
  rentals: localRentals,
  articles: localArticles,
  pages: [],
  agents: [],
  source: "local",
  loading: true,
};

const CmsContext = createContext<CmsContextValue>(fallbackValue);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [remote, setRemote] = useState<CmsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controllers = new Set<AbortController>();
    let disposed = false;
    let inFlight = false;
    let initialLoad = true;

    const refresh = async () => {
      if (disposed || inFlight) return;
      inFlight = true;
      const controller = new AbortController();
      controllers.add(controller);

      try {
        const content =
          (await fetchPublicSanityContent()) as CmsPayload | null;
        if (!content) {
          throw new Error(
            "Sanity public configuration is missing. Check the VITE_SANITY_* environment variables.",
          );
        }
        if (!disposed) setRemote(content);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (initialLoad) {
          console.warn(
            "[Canvas CMS] Sanity is unavailable; serving the bundled content snapshot.",
            error,
          );
        } else {
          console.warn("[Canvas CMS] Background content refresh failed.", error);
        }
      } finally {
        controllers.delete(controller);
        inFlight = false;
        if (!disposed && initialLoad) {
          initialLoad = false;
          setLoading(false);
        }
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 15_000);
    const refreshOnFocus = () => void refresh();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      controllers.forEach((controller) => controller.abort());
    };
  }, []);

  const value = useMemo<CmsContextValue>(() => {
    if (!remote) return { ...fallbackValue, loading };

    return {
      siteSettings: remote.siteSettings ?? defaultSiteSettings,
      listings: Array.isArray(remote.listings) ? remote.listings : localListings,
      rentals: Array.isArray(remote.rentals) ? remote.rentals : localRentals,
      articles: Array.isArray(remote.articles) ? remote.articles : localArticles,
      pages: Array.isArray(remote.pages) ? remote.pages : [],
      agents: Array.isArray(remote.agents) ? remote.agents : [],
      source: "sanity",
      loading,
    };
  }, [remote, loading]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}