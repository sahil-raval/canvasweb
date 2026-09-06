import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import logoPng from "@/assets/canvas/logo-white.png";

export function Footer() {
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
                <img src={logoPng} alt="Canvas Real Estate" className="h-14 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                Geelong's trusted independent real estate agency, blending local knowledge with modern precision to deliver exceptional results.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Youtube, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
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
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Free Appraisal", href: "/contact" },
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
                  <a href="tel:0469131347" className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Phone</p>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors font-medium">0469 131 347</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:enquiry@canvasrealestate.com.au" className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Email</p>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors font-medium break-all">enquiry@canvasrealestate.com.au</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-0.5">Location</p>
                    <p className="text-sm text-white/80 font-medium">Geelong, Victoria<br />Australia</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA Block */}
            <div>
              <h4 className="text-[10px] font-semibold font-sans uppercase tracking-[0.3em] text-white/40 mb-6">Ready to Move?</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Book a free, no-obligation property appraisal with Geelong's most trusted independent agency.
              </p>
              <Link href="/contact">
                <button className="w-full bg-white text-[#371628] text-sm font-bold py-3.5 rounded-2xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20">
                  Book Free Appraisal
                </button>
              </Link>
              <div className="mt-5 flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78z"/>
                  </svg>
                ))}
                <span className="text-white/60 text-xs ml-1">5.0 Google Rating</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© {new Date().getFullYear()} Canvas Real Estate Geelong. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/60 transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
