import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoPng from "@/assets/canvas/logo-dark.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHome = location === "/" || location === import.meta.env.BASE_URL;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Buy", href: "/listings" },
    { label: "Rent", href: "/rent" },
    { label: "Journal", href: "/journal" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const atTop = isHome && !isScrolled;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4">
        <motion.header
          style={{
            background: atTop
              ? "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(250,248,245,0.95) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(250,248,245,0.98) 100%)",
            boxShadow: atTop
              ? "0 4px 32px rgba(55,22,40,0.12), 0 1px 0 rgba(55,22,40,0.06)"
              : "0 8px 40px rgba(55,22,40,0.18), 0 2px 0 rgba(55,22,40,0.08)",
          }}
          className="rounded-2xl backdrop-blur-xl border border-[#371628]/10 overflow-hidden transition-all duration-500"
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="px-5 md:px-8 py-2 flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src={logoPng}
                alt="Canvas Real Estate"
                className="h-16 md:h-20 w-auto object-contain"
                style={{ maxWidth: "200px" }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-[#371628]/80 hover:text-[#371628] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#371628] rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:0469131347" className="flex items-center gap-2 text-[#371628] text-sm font-medium hover:opacity-70 transition-opacity">
                <Phone className="w-4 h-4" />
                0469 131 347
              </a>
              <Link href="/contact">
                <button className="bg-[#371628] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#2d1020] active:scale-95 transition-all duration-200 shadow-md shadow-[#371628]/20">
                  Free Appraisal
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-[#371628] hover:bg-[#371628]/5 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#371628]/10">
              <img src={logoPng} alt="Canvas Real Estate" className="h-14 w-auto object-contain" />
              <button
                className="p-2 rounded-xl text-[#371628] hover:bg-[#371628]/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="flex flex-col flex-1 px-6 pt-10 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-serif text-[#371628] py-4 border-b border-[#371628]/10 hover:pl-3 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-8 space-y-4">
                <a href="tel:0469131347" className="flex items-center gap-3 text-[#371628] font-medium text-lg">
                  <div className="w-10 h-10 rounded-full bg-[#371628]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#371628]" />
                  </div>
                  0469 131 347
                </a>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-[#371628] text-white font-semibold py-4 rounded-2xl text-lg mt-2 hover:bg-[#2d1020] transition-colors">
                    Book Free Appraisal
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
