"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useCms } from "@/lib/cms/context";
import { LEGAL_PAGES } from "@/lib/cms/routes";
import { googleRating } from "@/lib/cms/reviews";
import { Stars } from "@/components/Reviews";
const logoPng = "/images/logo-white.png";

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, youtube: Youtube } as const;
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function Footer() {
  const { siteSettings: s, suburbs, pages, landingPages } = useCms();
  const rating = googleRating(s);
  const legal = LEGAL_PAGES.filter((l) => pages.some((p) => p.slug === l.slug));
  const phone = s.phone || "0469 131 347";
  const email = s.email || "enquiry@canvasrealestate.com.au";
  const a = s.address;
  const socials = (s.socialLinks ?? [])
    .map((l) => ({ ...l, Icon: SOCIAL_ICONS[l.platform?.toLowerCase().trim() as keyof typeof SOCIAL_ICONS] }))
    .filter((l) => l.url && l.Icon);
  return (
    <div className="px-4 md:px-8 pb-6 pt-2">
      <footer
        className="rounded-3xl overflow-hidden text-white"
        style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 60%, #2a1020 100%)" }}
      >
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Main content */}
        <div className="px-8 md:px-14 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-7">
                <img loading="lazy" decoding="async" src={logoPng} alt="Canvas Real Estate" className="h-14 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                {s.tagline || "Geelong's trusted independent real estate agency, blending local knowledge with modern precision to deliver exceptional results."}
              </p>
              <div className="flex gap-3">
                {socials.map(({ Icon, url, platform }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${s.businessName} on ${platform}`}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200 group"
                  >
                    <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-semibold font-sans uppercase tracking-[0.3em] text-white/40 mb-6">Navigation</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "Current Listings", href: "/listings" },
                  { label: "Sold Properties", href: "/sold" },
                  ...(suburbs.length ? [{ label: "Suburb Guides", href: "/suburbs" }] : []),
                  ...landingPages.filter((l) => l.showInFooter).map((l) => ({ label: l.title, href: `/${l.slug}` })),
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Appraisal", href: "/contact" },
                ].map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors duration-200"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] font-semibold font-sans uppercase tracking-[0.3em] text-white/40 mb-6">Contact</h4>
              <ul className="space-y-5">
                <li>
                  <a href={telHref(phone)} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Phone</p>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors font-medium">{phone}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Email</p>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors font-medium break-all">{email}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Location</p>
                    <address className="text-sm text-white/80 font-medium not-italic">
                      {a?.street && <>{a.street}<br /></>}
                      {a?.suburb ? `${a.suburb} ${a.state || "VIC"} ${a.postcode || ""}`.trim() : s.location || "Geelong, Victoria"}
                      <br />Australia
                    </address>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA Block */}
            <div>
              <h4 className="text-[10px] font-semibold font-sans uppercase tracking-[0.3em] text-white/40 mb-6">Ready to Move?</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Book a no-obligation property appraisal with Geelong's most trusted independent agency.
              </p>
              <Link href="/contact">
                <button className="w-full bg-white text-[#371628] text-sm font-bold py-3.5 rounded-2xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20">
                  Book Appraisal
                </button>
              </Link>
              {rating && (
                <a
                  href={rating.readUrl || undefined}
                  target={rating.readUrl ? "_blank" : undefined}
                  rel={rating.readUrl ? "noopener noreferrer" : undefined}
                  className="mt-5 flex items-center gap-2"
                >
                  <Stars value={rating.rating} className="w-4 h-4 text-white fill-white" />
                  <span className="text-white/60 text-xs ml-1">
                    {rating.rating.toFixed(1)} Google Rating{rating.count ? ` · ${rating.count} reviews` : ""}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} {s.businessName}.{s.abn ? ` ABN ${s.abn}.` : ""}{s.licenceNumber ? ` Licence ${s.licenceNumber}.` : ""} All rights reserved.</p>
            <div className="flex gap-6">
              {legal.map((l) => (
                <Link key={l.slug} href={`/${l.slug}`} className="hover:text-white/60 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
