import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Bed, Bath, Car, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import type { Rental } from "@/data/rentals";
import { useCms } from "@/lib/cms";

/* ─── Fade-up ────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Rental card ────────────────────────────────────────── */
function RentalCard({ rental, index }: { rental: Rental; index: number }) {
  const availableNow = rental.available.toLowerCase() === "now";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white overflow-hidden flex flex-col h-full"
      style={{ boxShadow: "0 2px 16px rgba(55,22,40,0.07), 0 1px 3px rgba(55,22,40,0.04)" }}
      whileHover={{ y: -5, boxShadow: "0 16px 52px rgba(55,22,40,0.15), 0 4px 10px rgba(55,22,40,0.06)" } as any}
    >
      {/* Image */}
      <Link href={`/rent/${rental.slug}`} className="block">
        <div className="relative overflow-hidden" style={{ height: "260px" }}>
          <motion.img
            src={rental.heroImage}
            alt={rental.address}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0910]/75 via-[#1a0910]/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span
              className="text-white text-[8px] font-semibold font-sans uppercase tracking-[0.4em] px-3 py-1.5"
              style={{ background: "rgba(55,22,40,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              For Rent
            </span>
            {availableNow && (
              <span
                className="text-white text-[8px] font-semibold font-sans uppercase tracking-[0.4em] px-3 py-1.5"
                style={{ background: "rgba(22,101,52,0.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Available Now
              </span>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p
              className="text-white font-serif font-normal drop-shadow-lg"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
            >
              {rental.rentPw}
            </p>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Address */}
        <div className="flex items-start gap-2.5 mb-5">
          <MapPin className="w-3.5 h-3.5 text-[#371628]/40 shrink-0 mt-[3px]" strokeWidth={1.5} />
          <h3 className="font-sans font-medium text-[#2a1f25]/85 leading-snug" style={{ fontSize: "0.9rem" }}>
            {rental.address}, {rental.suburb} {rental.state}
          </h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 pb-5 mb-5 border-b border-[#371628]/7">
          {[
            { icon: Bed,  value: rental.beds,  label: "Bed"  },
            { icon: Bath, value: rental.baths, label: "Bath" },
            { icon: Car,  value: rental.cars,  label: "Car"  },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-7 h-7 border border-[#371628]/10 flex items-center justify-center">
                <Icon className="w-3 h-3 text-[#371628]/50" strokeWidth={1.5} />
              </div>
              <span className="text-[#2a1f25]/80 font-sans font-medium" style={{ fontSize: "0.9rem", fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
              <span className="text-[#371628]/35 font-sans text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* Availability chip */}
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-3.5 h-3.5 text-[#371628]/35" strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/45">
            Available: {rental.available}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link href={`/rent/${rental.slug}`}>
            <button className="w-full h-11 flex items-center justify-center gap-2.5 bg-[#371628] text-white font-sans font-semibold text-[13px] tracking-wide hover:bg-[#2d1020] transition-colors duration-300 group/btn">
              View Property
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Rent() {
  const { rentals, pages } = useCms();
  const page = pages.find((item) => item.slug === "rent");
  const available = rentals.filter(r => r.available.toLowerCase() === "now");
  const upcoming  = rentals.filter(r => r.available.toLowerCase() !== "now");

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
      >
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }} />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-10"
          style={{ background: "radial-gradient(ellipse at 80% 40%, #6b2548 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <motion.p
            className="text-[9px] uppercase tracking-[0.65em] text-white/35 font-semibold font-sans mb-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {page?.eyebrow || "Canvas Real Estate"}
          </motion.p>

          <motion.h1
            className="font-serif font-normal text-[#FAF8F5] leading-[1.04] mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "-0.015em" }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {page?.heading || "Rental Properties"}
          </motion.h1>

          <motion.div
            className="w-10 h-px bg-white/20 mb-6"
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <motion.p
            className="text-white/45 font-sans leading-[1.75] max-w-md"
            style={{ fontSize: "0.95rem" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.65 }}
          >
            {page?.intro || "Quality homes available across Geelong and surrounds — professionally managed and beautifully maintained."}
          </motion.p>

        </div>
      </section>

      {/* ── PROCESS STRIP ── */}
      <div className="bg-white border-b border-[#371628]/8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-wrap divide-x divide-[#371628]/8">
            {[
              { num: "01", label: "Inspect", desc: "Book an inspection online or by phone" },
              { num: "02", label: "Apply",   desc: "Submit your application via 2Apply" },
              { num: "03", label: "Approve", desc: "Receive approval within 48 hours" },
              { num: "04", label: "Move In", desc: "Collect keys and settle in" },
            ].map(({ num, label, desc }) => (
              <div key={num} className="flex-1 min-w-[180px] px-8 py-7 flex items-start gap-4">
                <span className="font-serif text-[#371628]/15 text-xl shrink-0 mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{num}</span>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.5em] font-semibold font-sans text-[#371628]/40 mb-1">{label}</p>
                  <p className="font-sans text-[#2a1f25]/60 leading-snug" style={{ fontSize: "0.82rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AVAILABLE NOW ── */}
      {available.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-8">
          <FadeUp className="flex items-center gap-5 mb-12">
            <div>
              <p className="text-[9px] uppercase tracking-[0.55em] text-[#371628]/35 font-semibold font-sans mb-2">
                Immediate Availability
              </p>
              <h2 className="font-serif font-normal text-[#2a1f25]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                Available Now
              </h2>
            </div>
            <div className="flex-1 h-px bg-[#371628]/8 hidden md:block" />
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/35">
                {available.length} {available.length === 1 ? "property" : "properties"}
              </span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {available.map((rental, i) => (
              <RentalCard key={rental.slug} rental={rental} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── COMING SOON ── */}
      {upcoming.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-20">
          <FadeUp className="flex items-center gap-5 mb-12">
            <div>
              <p className="text-[9px] uppercase tracking-[0.55em] text-[#371628]/35 font-semibold font-sans mb-2">
                Coming Soon
              </p>
              <h2 className="font-serif font-normal text-[#2a1f25]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                Upcoming Rentals
              </h2>
            </div>
            <div className="flex-1 h-px bg-[#371628]/8 hidden md:block" />
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcoming.map((rental, i) => (
              <RentalCard key={rental.slug} rental={rental} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── TENANCY CTA ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-24">
        <FadeUp>
          <div
            className="relative overflow-hidden px-10 md:px-20 py-16 md:py-20"
            style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
          >
            {/* Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "180px",
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-white/8" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />

            <div className="relative max-w-2xl">
              <p className="text-[9px] uppercase tracking-[0.65em] text-white/30 font-semibold font-sans mb-5">
                Property Management
              </p>
              <h2
                className="font-serif font-normal text-[#FAF8F5] leading-[1.08] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Can't Find the Right Home?
              </h2>
              <div className="w-8 h-px bg-white/20 mb-7" />
              <p className="text-white/40 font-sans leading-[1.8] mb-10 max-w-lg" style={{ fontSize: "0.95rem" }}>
                Register your requirements with our property management team and we'll notify you the moment a suitable home becomes available — including off-market opportunities.
              </p>

              {/* Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {[
                  "Priority notification on new listings",
                  "Access to off-market properties",
                  "Dedicated property manager",
                  "Online maintenance requests",
                ].map(perk => (
                  <div key={perk} className="flex items-center gap-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/30 shrink-0" strokeWidth={1.5} />
                    <span className="text-white/45 font-sans" style={{ fontSize: "0.875rem" }}>{perk}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact">
                <button className="inline-flex items-center gap-3 bg-white text-[#371628] font-sans font-semibold text-[13px] tracking-wide px-9 py-3.5 hover:bg-[#FAF8F5] transition-colors duration-300">
                  Register Your Interest
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
