import { motion } from "framer-motion";
import { Bed, Bath, Car, MapPin, ArrowRight, Maximize2 } from "lucide-react";
import { Link } from "wouter";
import type { Listing } from "@/data/listings";

const isLand = (listing: Listing) =>
  listing.type === "Land" || listing.type === "Lot" || listing.beds === 0;

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const landListing = isLand(listing);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white overflow-hidden flex flex-col h-full"
      style={{ boxShadow: "0 2px 16px rgba(55,22,40,0.07), 0 1px 3px rgba(55,22,40,0.04)" }}
      whileHover={{ y: -5, boxShadow: "0 16px 52px rgba(55,22,40,0.16), 0 4px 10px rgba(55,22,40,0.07)" } as any}
    >
      {/* Image */}
      <Link href={`/listings/${listing.slug}`} className="block">
        <div className="relative overflow-hidden cursor-pointer" style={{ height: "260px" }}>
          {/* Static base image */}
          <img
            src={listing.heroImage}
            alt={listing.address}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Hover zoom layer */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={listing.heroImage}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0910]/75 via-[#1a0910]/10 to-transparent" />

          {/* Status + type badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span
              className="text-white text-[8px] font-semibold font-sans uppercase tracking-[0.4em] px-3 py-1.5"
              style={{ background: "rgba(55,22,40,0.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {listing.status}
            </span>
            <span
              className="text-white text-[8px] font-semibold font-sans uppercase tracking-[0.4em] px-3 py-1.5"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              {listing.type}
            </span>
          </div>

          {/* Price — serif, tabular nums */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p
              className="text-white font-serif font-normal drop-shadow-lg"
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.01em",
              }}
            >
              {listing.price}
            </p>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-grow">

        {/* Address */}
        <div className="flex items-start gap-2.5 mb-5">
          <MapPin className="w-3.5 h-3.5 text-[#371628]/40 shrink-0 mt-[3px]" strokeWidth={1.5} />
          <h3
            className="font-sans font-medium text-[#2a1f25]/85 leading-snug"
            style={{ fontSize: "0.9rem" }}
          >
            {listing.address}, {listing.suburb} {listing.state}
          </h3>
        </div>

        {/* Stats row — hidden for land listings, shown for houses */}
        {!landListing ? (
          <div className="flex items-center gap-5 pb-5 mb-5 border-b border-[#371628]/7">
            {[
              { icon: Bed,  value: listing.beds,  label: "Bed"  },
              { icon: Bath, value: listing.baths, label: "Bath" },
              { icon: Car,  value: listing.cars,  label: "Car"  },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-7 h-7 border border-[#371628]/10 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-[#371628]/50" strokeWidth={1.5} />
                </div>
                <span
                  className="text-[#2a1f25]/80 font-sans font-medium"
                  style={{ fontSize: "0.9rem", fontVariantNumeric: "tabular-nums" }}
                >
                  {value}
                </span>
                <span className="text-[#371628]/35 font-sans text-xs">{label}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Land: show land size only */
          <div className="flex items-center gap-2.5 pb-5 mb-5 border-b border-[#371628]/7">
            <div className="w-7 h-7 border border-[#371628]/10 flex items-center justify-center">
              <Maximize2 className="w-3 h-3 text-[#371628]/50" strokeWidth={1.5} />
            </div>
            <span
              className="text-[#2a1f25]/80 font-sans font-medium"
              style={{ fontSize: "0.9rem", fontVariantNumeric: "tabular-nums" }}
            >
              {listing.land}
            </span>
            <span className="text-[#371628]/35 font-sans text-xs">Land Area</span>
          </div>
        )}

        {/* CTA — full width */}
        <div className="mt-auto">
          <Link href={`/listings/${listing.slug}`}>
            <button
              className="w-full h-11 flex items-center justify-center gap-2.5 bg-[#371628] text-white font-sans font-semibold text-[13px] tracking-wide hover:bg-[#2d1020] transition-colors duration-300 group/btn"
            >
              View Property
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
