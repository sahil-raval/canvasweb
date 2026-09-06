import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { useCms } from "@/lib/cms";

const suburbs = ["All Suburbs", "Lara", "Armstrong Creek", "Tarneit", "Geelong"];
const bedOptions = [
  { value: "any", label: "Any Beds" },
  { value: "2",   label: "2+ Beds" },
  { value: "3",   label: "3+ Beds" },
  { value: "4",   label: "4+ Beds" },
  { value: "5",   label: "5+ Beds" },
];

export default function Listings() {
  const { listings, pages } = useCms();
  const page = pages.find((item) => item.slug === "listings");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [bedFilter,    setBedFilter]    = useState("any");
  const [suburbFilter, setSuburbFilter] = useState("All Suburbs");

  const filtered = listings.filter((l) => {
    const fullAddress = `${l.address}, ${l.suburb} ${l.state}`;
    const search = fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const beds   = bedFilter === "any" || l.beds >= parseInt(bedFilter);
    const suburb = suburbFilter === "All Suburbs" || l.suburb === suburbFilter;
    return search && beds && suburb;
  });

  const activeFilters = [
    bedFilter !== "any"           && { key: "beds",   label: `${bedFilter}+ Beds`, clear: () => setBedFilter("any") },
    suburbFilter !== "All Suburbs" && { key: "suburb", label: suburbFilter,         clear: () => setSuburbFilter("All Suburbs") },
    searchTerm                    && { key: "search", label: `"${searchTerm}"`,    clear: () => setSearchTerm("") },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}>
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold font-sans mb-4">{page?.eyebrow || "Geelong Properties"}</p>
            <h1 className="text-5xl md:text-6xl font-serif font-normal text-white mb-4">{page?.heading || "Current Listings"}</h1>
            <p className="text-white/65 text-lg font-sans max-w-xl mb-10">
              {page?.intro || "Expertly curated properties across Geelong and surrounds. Each one hand-selected and professionally presented."}
            </p>

            {/* Search bar */}
            <div className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 px-5 py-3">
              <Search className="w-5 h-5 text-white/60 shrink-0" />
              <input
                type="text"
                placeholder="Search suburb, street or postcode…"
                className="flex-1 bg-transparent text-white placeholder:text-white/50 text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar hidden per design decision */}

      {/* ── LISTINGS GRID ────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        {/* Urgency nudge */}
        <div className="flex items-center gap-3 mb-8 bg-white border border-[#371628]/10 rounded-2xl px-5 py-3 w-fit shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-xs text-[#371628]/70 font-semibold">
            Properties at this level are actively receiving enquiries. Act early to avoid missing out
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.slug} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-[#371628]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-7 h-7 text-[#371628]/40" />
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-3">No Properties Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              No properties match your current search. Try adjusting your filters, or get in touch and we'll find your perfect match, including off-market listings.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSearchTerm(""); setBedFilter("any"); setSuburbFilter("All Suburbs"); }}
                className="text-sm font-semibold text-[#371628] border border-[#371628]/20 px-6 py-2.5 rounded-xl hover:bg-[#371628]/5 transition-colors"
              >
                Clear Filters
              </button>
              <a href="/contact" className="text-sm font-semibold bg-[#371628] text-white px-6 py-2.5 rounded-xl hover:bg-[#4a1e35] transition-colors">
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── OFF-MARKET CTA ───────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl text-white p-10 md:p-14 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
        >
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold font-sans mb-4">Exclusive Access</p>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-white/65 text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
              We have access to off-market properties and upcoming listings before they hit the public market. Tell us what you need.
            </p>
            <a href="/contact">
              <button className="h-12 px-10 text-sm font-bold bg-white text-[#371628] rounded-2xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg">
                Register Your Interest
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
