import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useParams } from "wouter";
import {
  Bed, Bath, Car, ArrowLeft, Phone, Mail, ArrowRight,
  Maximize2, Home, MapPin, Check, ChevronLeft, ChevronRight, X,
  FileText, LayoutTemplate, ExternalLink,
} from "lucide-react";
import type { Listing } from "@/data/listings";
import { useCms } from "@/lib/cms";
import poojaImg from "@/assets/canvas/agent-pooja-new.jpg";
import chandraImg from "@/assets/canvas/agent-chandra-new.jpg";

/* ─── Eyebrow ────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.35em] text-[#371628]/45 font-semibold font-sans">
      {children}
    </p>
  );
}

/* ─── Section divider ────────────────────────────────────── */
function Divider() {
  return <div className="h-px bg-[#371628]/8 my-14" />;
}

/* ─── Fade-up util ───────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floor plan SVG ─────────────────────────────────────── */
type Room = {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; small?: boolean;
};

function RoomRect({ r, scale }: { r: Room; scale: number }) {
  const cx = (r.x + r.w / 2) * scale;
  const cy = (r.y + r.h / 2) * scale;
  const fs = r.small ? 8.5 : 10;
  return (
    <g>
      <rect
        x={r.x * scale} y={r.y * scale}
        width={r.w * scale} height={r.h * scale}
        fill="#FDFBF8" stroke="#371628" strokeWidth={1}
      />
      <text x={cx} y={r.sub ? cy - 7 : cy + 4}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="Inter, sans-serif" fontSize={fs}
        fill="#2a1f25" fontWeight={500}
        style={{ userSelect: "none" }}
      >
        {r.label}
      </text>
      {r.sub && (
        <text x={cx} y={cy + 9}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter, sans-serif" fontSize={7.5}
          fill="#371628" opacity={0.45}
          style={{ userSelect: "none" }}
        >
          {r.sub}
        </text>
      )}
    </g>
  );
}

/* Door arc indicator */
function Door({ x, y, r, startAngle, endAngle, scale }: {
  x: number; y: number; r: number; startAngle: number; endAngle: number; scale: number;
}) {
  const sx = (x + r * Math.cos((startAngle * Math.PI) / 180)) * scale;
  const sy = (y + r * Math.sin((startAngle * Math.PI) / 180)) * scale;
  const ex = (x + r * Math.cos((endAngle * Math.PI) / 180)) * scale;
  const ey = (y + r * Math.sin((endAngle * Math.PI) / 180)) * scale;
  return (
    <g>
      <line x1={x * scale} y1={y * scale} x2={sx} y2={sy} stroke="#371628" strokeWidth={0.8} opacity={0.5} />
      <path d={`M ${sx} ${sy} A ${r * scale} ${r * scale} 0 0 1 ${ex} ${ey}`}
        stroke="#371628" strokeWidth={0.8} fill="none" opacity={0.5} />
    </g>
  );
}

function FloorPlanSVG({ beds, cars }: { beds: number; cars: number }) {
  /* ── 3-bed layout (580 × 400) ── */
  const rooms3: Room[] = [
    { x: 0,   y: 0,   w: 185, h: 160, label: "Bedroom 2",    sub: "3.2 × 3.0 m" },
    { x: 185, y: 0,   w: 165, h: 160, label: "Bedroom 3",    sub: "3.0 × 3.0 m" },
    { x: 350, y: 0,   w: 230, h: 280, label: "Living / Dining", sub: "7.2 × 5.2 m" },
    { x: 0,   y: 160, w: 185, h: 120, label: "Master",       sub: "4.0 × 3.6 m" },
    { x: 185, y: 160, w: 95,  h: 120, label: "Ensuite",      sub: "2.4 × 3.0 m", small: true },
    { x: 280, y: 160, w: 70,  h: 120, label: "WIR",          small: true },
    { x: 0,   y: 280, w: cars > 1 ? 230 : 185, h: 120, label: cars > 1 ? "Double Garage" : "Garage", sub: cars > 1 ? "5.8 × 6.0 m" : "3.0 × 6.0 m" },
    { x: cars > 1 ? 230 : 185, y: 280, w: cars > 1 ? 60 : 95, h: 60, label: "Laundry", small: true },
    { x: cars > 1 ? 230 : 185, y: 340, w: cars > 1 ? 60 : 95, h: 60, label: "WC",      small: true },
    { x: cars > 1 ? 290 : 280, y: 280, w: cars > 1 ? 60 : 70, h: 120, label: "Bath",   small: true },
    { x: 350, y: 280, w: 230, h: 120, label: "Kitchen / Meals", sub: "5.2 × 3.6 m" },
  ];

  /* ── 4-bed layout (680 × 420) ── */
  const rooms4: Room[] = [
    { x: 0,   y: 0,   w: 170, h: 160, label: "Bedroom 2",  sub: "3.2 × 3.2 m" },
    { x: 170, y: 0,   w: 160, h: 160, label: "Bedroom 3",  sub: "3.0 × 3.2 m" },
    { x: 330, y: 0,   w: 150, h: 160, label: "Bedroom 4",  sub: "3.0 × 3.2 m" },
    { x: 480, y: 0,   w: 200, h: 280, label: "Living / Dining", sub: "6.8 × 5.5 m" },
    { x: 0,   y: 160, w: 170, h: 120, label: "Master",     sub: "4.2 × 3.8 m" },
    { x: 170, y: 160, w: 90,  h: 120, label: "Ensuite",    sub: "2.5 × 3.0 m", small: true },
    { x: 260, y: 160, w: 70,  h: 120, label: "WIR",        small: true },
    { x: 330, y: 160, w: 150, h: 120, label: "Study",      sub: "2.8 × 3.0 m", small: true },
    { x: 0,   y: 280, w: 240, h: 140, label: "Double Garage", sub: "5.8 × 7.0 m" },
    { x: 240, y: 280, w: 90,  h: 70,  label: "Laundry",   small: true },
    { x: 240, y: 350, w: 90,  h: 70,  label: "WC",        small: true },
    { x: 330, y: 280, w: 150, h: 140, label: "Bathroom",  sub: "2.8 × 3.6 m", small: true },
    { x: 480, y: 280, w: 200, h: 140, label: "Kitchen / Meals", sub: "5.0 × 3.8 m" },
  ];

  /* ── 5-bed layout (780 × 440) ── */
  const rooms5: Room[] = [
    { x: 0,   y: 0,   w: 155, h: 165, label: "Bedroom 2",  sub: "3.2 × 3.4 m" },
    { x: 155, y: 0,   w: 155, h: 165, label: "Bedroom 3",  sub: "3.2 × 3.4 m" },
    { x: 310, y: 0,   w: 155, h: 165, label: "Bedroom 4",  sub: "3.2 × 3.4 m" },
    { x: 465, y: 0,   w: 155, h: 165, label: "Bedroom 5",  sub: "3.0 × 3.4 m" },
    { x: 620, y: 0,   w: 160, h: 300, label: "Living / Dining", sub: "7.0 × 6.2 m" },
    { x: 0,   y: 165, w: 155, h: 135, label: "Master",     sub: "4.4 × 4.2 m" },
    { x: 155, y: 165, w: 90,  h: 135, label: "Ensuite",    sub: "Freestanding\nBath", small: true },
    { x: 245, y: 165, w: 65,  h: 135, label: "WIR",        small: true },
    { x: 310, y: 165, w: 155, h: 135, label: "Theatre",    sub: "5.5 × 4.0 m" },
    { x: 465, y: 165, w: 155, h: 135, label: "Study",      sub: "3.0 × 3.4 m", small: true },
    { x: 0,   y: 300, w: 260, h: 140, label: "Double Garage", sub: "5.8 × 7.0 m" },
    { x: 260, y: 300, w: 90,  h: 70,  label: "Laundry",   small: true },
    { x: 260, y: 370, w: 90,  h: 70,  label: "WC",        small: true },
    { x: 350, y: 300, w: 120, h: 140, label: "Bathroom",  sub: "3.2 × 3.8 m", small: true },
    { x: 470, y: 300, w: 150, h: 140, label: "Ensuite 2", sub: "3.0 × 3.8 m", small: true },
    { x: 620, y: 300, w: 160, h: 140, label: "Kitchen / Butler's", sub: "5.5 × 3.8 m" },
  ];

  let rooms: Room[];
  let vbW: number, vbH: number;

  if (beds <= 3) {
    rooms = rooms3; vbW = 580; vbH = 400;
  } else if (beds === 4) {
    rooms = rooms4; vbW = 680; vbH = 420;
  } else {
    rooms = rooms5; vbW = 780; vbH = 440;
  }

  /* Scale to fit 100% width, max height ~380px */
  const scale = 1;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`-1 -1 ${vbW + 2} ${vbH + 2}`}
        className="w-full h-auto"
        style={{ maxHeight: "420px", background: "#FDFBF8" }}
      >
        {/* Outer wall — heavier stroke */}
        <rect x={0} y={0} width={vbW} height={vbH}
          fill="none" stroke="#371628" strokeWidth={3} />

        {/* Compass rose */}
        <g transform={`translate(${vbW - 24}, 18)`}>
          <text textAnchor="middle" fontFamily="Inter" fontSize={8} fill="#371628" opacity={0.4} y={0}>N</text>
          <line x1={0} y1={3} x2={0} y2={11} stroke="#371628" strokeWidth={1.2} opacity={0.35} />
        </g>

        {/* Room rectangles */}
        {rooms.map((r, i) => <RoomRect key={i} r={r} scale={scale} />)}

        {/* Sample door arcs — front doors */}
        {beds <= 3 && <Door x={92} y={400} r={30} startAngle={270} endAngle={0}   scale={scale} />}
        {beds === 4 && <Door x={120} y={420} r={30} startAngle={270} endAngle={0} scale={scale} />}
        {beds >= 5  && <Door x={130} y={440} r={30} startAngle={270} endAngle={0} scale={scale} />}
      </svg>
    </div>
  );
}

/* ─── Floor Plan section ─────────────────────────────────── */
function FloorPlanSection({ beds, cars }: { beds: number; cars: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <FadeUp>
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-[#371628]/5 flex items-center justify-center shrink-0 mt-0.5">
            <LayoutTemplate className="w-4 h-4 text-[#371628]" strokeWidth={1.5} />
          </div>
          <div>
            <Eyebrow>Floor Plan</Eyebrow>
            <p className="font-serif font-normal text-[#2a1f25] mt-1" style={{ fontSize: "1.2rem" }}>
              Schematic Layout
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[9px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/40 hover:text-[#371628] transition-colors border-b border-[#371628]/15 hover:border-[#371628]/45 pb-0.5"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 280, overflow: "hidden" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative" }}
      >
        <div className="border border-[#371628]/10 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#371628]/8 bg-[#371628]/[0.025]">
            <span className="text-[8.5px] uppercase tracking-[0.45em] font-semibold font-sans text-[#371628]/35">
              Ground Floor — Not to Scale
            </span>
            <span className="text-[8.5px] uppercase tracking-[0.45em] font-semibold font-sans text-[#371628]/25">
              Indicative Only
            </span>
          </div>
          <div className="p-4">
            <FloorPlanSVG beds={beds} cars={cars} />
          </div>
          {/* Legend */}
          <div className="px-5 py-3 border-t border-[#371628]/8 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { color: "#FDFBF8", label: "Living Spaces" },
              { color: "#FAF4F7", label: "Bedrooms" },
              { color: "#F5F0F2", label: "Wet Areas" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#371628]/20" style={{ background: color }} />
                <span className="text-[8.5px] font-sans text-[#371628]/35 tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade-out mask when collapsed */}
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #FAF8F5 88%)" }}
          />
        )}
      </motion.div>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 text-[9px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/40 hover:text-[#371628] transition-colors"
        >
          View full floor plan ↓
        </button>
      )}
    </FadeUp>
  );
}

/* ─── Statement of Information ───────────────────────────── */
function StatementOfInformation({ listing }: { listing: Listing }) {
  if (!listing) return null;
  const { soi } = listing;

  return (
    <FadeUp>
      {/* Header */}
      <div className="flex items-start gap-4 mb-7">
        <div className="w-9 h-9 bg-[#371628]/5 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-4 h-4 text-[#371628]" strokeWidth={1.5} />
        </div>
        <div>
          <Eyebrow>Legal Document</Eyebrow>
          <p className="font-serif font-normal text-[#2a1f25] mt-1" style={{ fontSize: "1.2rem" }}>
            Statement of Information
          </p>
        </div>
      </div>

      <div className="border border-[#371628]/10">
        {/* SOI header band */}
        <div className="bg-[#371628] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-[8px] uppercase tracking-[0.55em] font-semibold font-sans mb-1">
              Consumer Affairs Victoria
            </p>
            <p className="text-white font-serif font-normal leading-tight" style={{ fontSize: "1.05rem" }}>
              Statement of Information
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/35 text-[8px] uppercase tracking-[0.45em] font-semibold font-sans mb-1">
              Sale Method
            </p>
            <p className="text-white font-sans font-semibold text-sm tracking-wide">
              {soi.method}
            </p>
          </div>
        </div>

        {/* Price section */}
        <div className="px-6 py-6 border-b border-[#371628]/8 grid grid-cols-2 gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#371628]/38 font-semibold font-sans mb-2">
              Indicative Selling Price
            </p>
            <p className="font-serif font-normal text-[#371628]" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}>
              {soi.indicativeRange}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-[#371628]/38 font-semibold font-sans mb-2">
              Property Address
            </p>
            <p className="font-sans text-[#2a1f25]/80 text-sm leading-snug">
              {listing.address}<br />
              {listing.suburb}, {listing.state}
            </p>
          </div>
        </div>

        {/* Comparable sales */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#371628]/38 font-semibold font-sans mb-5">
            3 Comparable Properties Sold (Last 6 Months, Within 2km)
          </p>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 pb-2.5 border-b border-[#371628]/10 mb-1">
            {["Property Address", "Sale Date", "Price", "Bed", "Bath", "Land"].map((h, i) => (
              <div
                key={h}
                className={`text-[8px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/30 ${
                  i === 0 ? "col-span-4" : i === 2 ? "col-span-2" : "col-span-1"
                } ${i === 5 ? "hidden sm:block" : ""}`}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {soi.comparableSales.map((sale, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 py-3.5 border-b border-[#371628]/6 last:border-0 items-center"
            >
              {/* Address */}
              <div className="col-span-4">
                <p className="font-sans text-[#2a1f25]/80 text-[12px] leading-snug">
                  {sale.address}
                </p>
                <p className="text-[10px] text-[#371628]/35 font-sans">{sale.suburb}</p>
              </div>
              {/* Date */}
              <div className="col-span-2">
                <span className="text-[11px] font-sans text-[#2a1f25]/65">{sale.saleDate}</span>
              </div>
              {/* Price */}
              <div className="col-span-2">
                <span className="font-serif text-[#371628]" style={{ fontSize: "0.95rem" }}>
                  {sale.salePrice}
                </span>
              </div>
              {/* Bed */}
              <div className="col-span-1 flex items-center gap-1">
                <Bed className="w-3 h-3 text-[#371628]/30" strokeWidth={1.5} />
                <span className="text-[11px] font-sans text-[#2a1f25]/65">{sale.beds}</span>
              </div>
              {/* Bath */}
              <div className="col-span-1 flex items-center gap-1">
                <Bath className="w-3 h-3 text-[#371628]/30" strokeWidth={1.5} />
                <span className="text-[11px] font-sans text-[#2a1f25]/65">{sale.baths}</span>
              </div>
              {/* Land */}
              <div className="col-span-2 hidden sm:block">
                <span className="text-[11px] font-sans text-[#2a1f25]/65">{sale.land}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legal disclaimer */}
        <div className="px-6 py-5 bg-[#371628]/[0.025] border-t border-[#371628]/8">
          <p className="text-[10px] font-sans text-[#371628]/38 leading-[1.7]">
            This Statement of Information has been prepared in accordance with the <em>Sale of Land Act 1962</em> (Vic). The indicative selling price is based on comparable sales and market conditions. Comparable sales data sourced from CoreLogic. This document does not constitute financial advice.{" "}
            <a
              href="https://www.consumer.vic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#371628]/55 hover:text-[#371628] underline underline-offset-2 transition-colors"
            >
              Consumer Affairs Victoria
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ images, current, onClose, onPrev, onNext }: {
  images: string[]; current: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/96 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
      >
        <X className="w-7 h-7" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 bg-white/8 hover:bg-white/15"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <motion.img
        key={current}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={images[current]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 bg-white/8 hover:bg-white/15"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/28"}`} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Enquiry form ───────────────────────────────────────── */
function EnquiryForm({ address, agentName }: { address: string; agentName: string }) {
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [form, setForm]     = useState({
    name: "", email: "", phone: "",
    message: `I'm interested in ${address} and would like to arrange an inspection.`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, property: address, enquiryType: "Buy a Property" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any).error ?? "Something went wrong");
      }
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Could not send. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-12 h-12 bg-[#371628]/8 flex items-center justify-center mx-auto mb-5">
          <Check className="w-5 h-5 text-[#371628]" />
        </div>
        <h3 className="font-serif text-[#2a1f25] text-xl mb-2">Enquiry Sent</h3>
        <p className="text-[#371628]/40 text-sm leading-relaxed font-sans">
          Thank you. {agentName} will be in touch within 24 hours.
        </p>
      </div>
    );
  }

  const inputCls = "w-full border border-[#371628]/12 px-4 py-3 text-sm font-sans text-[#2a1f25]/80 placeholder:text-[#371628]/20 focus:outline-none focus:border-[#371628]/40 transition-colors bg-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { field: "name", label: "Full Name", type: "text", required: true },
        { field: "email", label: "Email Address", type: "email", required: true },
        { field: "phone", label: "Phone Number", type: "tel", required: false },
      ].map(({ field, label, type, required }) => (
        <div key={field}>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-[#371628]/38 font-semibold font-sans mb-2">{label}</label>
          <input
            type={type} required={required}
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className={inputCls}
          />
        </div>
      ))}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-[#371628]/38 font-semibold font-sans mb-2">Message</label>
        <textarea
          rows={4} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputCls} resize-none`}
        />
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <button
        type="submit" disabled={loading}
        className="w-full bg-[#371628] text-white text-[11px] font-semibold uppercase tracking-[0.3em] py-4 hover:bg-[#2d1020] transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {loading ? "Sending…" : <> Send Enquiry <ArrowRight className="w-3.5 h-3.5" /> </>}
      </button>
      <p className="text-center text-[9.5px] text-[#371628]/25 tracking-wide font-sans">
        100% confidential · No obligation
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ListingDetail() {
  const { listings, agents } = useCms();
  const { slug }  = useParams<{ slug: string }>();
  const listing   = listings.find((item) => item.slug === (slug || ""));
  const heroRef   = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx,  setLightboxIdx]  = useState(0);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-7">
        <p className="font-serif text-3xl text-[#371628]/30">Property Not Found</p>
        <Link href="/listings">
          <button className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] font-semibold font-sans text-[#371628]/40 hover:text-[#371628] transition-colors border-b border-[#371628]/20 hover:border-[#371628]/50 pb-0.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
          </button>
        </Link>
      </div>
    );
  }

  const cmsAgent = agents.find((agent) => agent.key === listing.agent);
  const agentName  = cmsAgent?.name ?? (listing.agent === "pooja" ? "Pooja Patel" : "Chandra Bhatt");
  const agentImg   = cmsAgent?.photo ?? (listing.agent === "pooja" ? poojaImg : chandraImg);
  const agentTitle = cmsAgent?.role ?? (listing.agent === "pooja" ? "Director & Founder" : "Director & Co-Founder");
  const allImages  = [listing.heroImage, ...listing.gallery];

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = () => setLightboxIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setLightboxIdx((i) => (i + 1) % allImages.length);

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: heroY }}>
          <img src={listing.heroImage} alt={listing.address} className="w-full h-full object-cover" />
        </motion.div>

        <div className="absolute top-0 left-0 right-0 z-20 pt-6 px-6 md:px-10 mt-16">
          <Link href="/listings">
            <span className="inline-flex items-center gap-2.5 text-white/55 text-[9px] font-semibold font-sans uppercase tracking-[0.45em] hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              {listing.address} · {listing.suburb}
            </span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(55,22,40,0.92) 0%, rgba(55,22,40,0.5) 55%, transparent 100%)" }} />
          <div className="relative z-10 px-6 md:px-10 pb-10 pt-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-white leading-none"
                style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                {listing.address}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="flex flex-col md:items-end gap-1.5 shrink-0"
              >
                <p className="text-white/70 text-sm font-sans tracking-[0.08em]">
                  {listing.suburb}, {listing.state}
                </p>
                <span className="text-[9px] font-semibold font-sans uppercase tracking-[0.35em] text-white/45 border border-white/18 px-3 py-1 w-fit">
                  {listing.status}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY SPECS STRIP ── */}
      <section className="bg-white border-b border-[#371628]/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-stretch divide-x divide-[#371628]/8">
            <div className="py-8 pr-8 md:pr-12 shrink-0">
              <Eyebrow>Price Guide</Eyebrow>
              <p className="font-serif text-[#371628] mt-1" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}>
                {listing.price}
              </p>
            </div>
            {[
              { icon: Bed,       value: listing.beds,  label: listing.beds === 1 ? "Bedroom" : "Bedrooms" },
              { icon: Bath,      value: listing.baths, label: listing.baths === 1 ? "Bathroom" : "Bathrooms" },
              { icon: Car,       value: listing.cars,  label: listing.cars === 1 ? "Car Space" : "Car Spaces" },
              { icon: Maximize2, value: listing.land,  label: "Land Size" },
              { icon: Home,      value: listing.type,  label: "Property Type" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="py-8 px-6 md:px-10 flex flex-col gap-1">
                <Icon className="w-4 h-4 text-[#371628]/35 mb-1" strokeWidth={1.5} />
                <p className="font-serif text-[#2a1f25] text-lg leading-none">{value}</p>
                <Eyebrow>{label}</Eyebrow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-20 md:py-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 xl:gap-24">

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Description */}
              <FadeUp>
                <Eyebrow>About This Property</Eyebrow>
              </FadeUp>
              <div className="space-y-6 mt-7 mb-14">
                {listing.description.map((para, i) => (
                  <FadeUp key={i} delay={i * 0.07}>
                    <p className="text-[#2a1f25]/60 leading-[1.9] font-sans" style={{ fontSize: "0.975rem" }}>{para}</p>
                  </FadeUp>
                ))}
              </div>

              <Divider />

              {/* Features */}
              <FadeUp>
                <Eyebrow>Property Features</Eyebrow>
              </FadeUp>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mt-7 mb-14">
                {listing.features.map((feat, i) => (
                  <FadeUp key={i} delay={i * 0.04}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-5 h-5 border border-[#371628]/18 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#371628]" strokeWidth={2.5} />
                      </div>
                      <span className="text-[#2a1f25]/65 font-sans leading-relaxed" style={{ fontSize: "0.9rem" }}>
                        {feat}
                      </span>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <Divider />

              {/* ── FLOOR PLAN ── */}
              <FloorPlanSection beds={listing.beds} cars={listing.cars} />

              <Divider />

              {/* ── STATEMENT OF INFORMATION ── */}
              <StatementOfInformation listing={listing} />

              <Divider />

              {/* Photo Gallery */}
              <FadeUp>
                <Eyebrow>Photo Gallery</Eyebrow>
              </FadeUp>
              <div className="grid grid-cols-12 gap-3 mt-7">
                <FadeUp className="col-span-12 md:col-span-8">
                  <button onClick={() => openLightbox(0)}
                    className="w-full overflow-hidden group relative block" style={{ aspectRatio: "16/10" }}>
                    <img src={listing.heroImage} alt="Main photo"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
                  </button>
                </FadeUp>
                <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                  {listing.gallery.slice(0, 2).map((img, i) => (
                    <FadeUp key={i} delay={0.06 * (i + 1)}>
                      <button onClick={() => openLightbox(i + 1)}
                        className="w-full overflow-hidden group relative block" style={{ aspectRatio: "4/3" }}>
                        <img src={img} alt={`Photo ${i + 2}`}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
                      </button>
                    </FadeUp>
                  ))}
                </div>
                {listing.gallery.slice(2, 4).map((img, i) => (
                  <FadeUp key={i} className="col-span-6" delay={0.1 + i * 0.06}>
                    <button onClick={() => openLightbox(i + 3)}
                      className="w-full overflow-hidden group relative block" style={{ aspectRatio: "16/10" }}>
                      <img src={img} alt={`Photo ${i + 4}`}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                      {i === 1 && allImages.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-serif text-lg">+{allImages.length - 4} more</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
                    </button>
                  </FadeUp>
                ))}
              </div>

              <FadeUp className="mt-5">
                <button onClick={() => openLightbox(0)}
                  className="text-[9px] font-semibold uppercase tracking-[0.35em] font-sans text-[#371628] border border-[#371628]/22 px-6 py-3 hover:bg-[#371628] hover:text-white transition-all duration-300">
                  View All Photos ({allImages.length})
                </button>
              </FadeUp>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="relative">
              <div className="lg:sticky lg:top-28 space-y-5">

                {/* Agent card */}
                <FadeUp>
                  <div className="border border-[#371628]/10 p-7 bg-white">
                    <Eyebrow>Your Agent</Eyebrow>
                    <div className="flex items-center gap-4 mt-5 mb-6">
                      <div className="w-14 h-14 overflow-hidden shrink-0 border border-[#371628]/10">
                        <img src={agentImg} alt={agentName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <p className="font-serif text-[#2a1f25] text-lg leading-tight">{agentName}</p>
                        <p className="text-[10px] text-[#371628]/38 tracking-wide font-sans mt-0.5">{agentTitle}</p>
                        <p className="text-[10px] text-[#371628]/30 font-sans">Canvas Real Estate</p>
                      </div>
                    </div>
                    <div className="space-y-3 border-t border-[#371628]/8 pt-5">
                      <a href="tel:0469131347"
                        className="flex items-center gap-3 font-sans text-sm text-[#2a1f25]/65 hover:text-[#371628] transition-colors group">
                        <div className="w-8 h-8 bg-[#371628]/5 flex items-center justify-center group-hover:bg-[#371628]/10 transition-colors">
                          <Phone className="w-3.5 h-3.5 text-[#371628]" strokeWidth={1.5} />
                        </div>
                        0469 131 347
                      </a>
                      <a href="mailto:enquiry@canvasrealestate.com.au"
                        className="flex items-center gap-3 font-sans text-sm text-[#2a1f25]/65 hover:text-[#371628] transition-colors group">
                        <div className="w-8 h-8 bg-[#371628]/5 flex items-center justify-center group-hover:bg-[#371628]/10 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-[#371628]" strokeWidth={1.5} />
                        </div>
                        enquiry@canvasrealestate.com.au
                      </a>
                    </div>
                  </div>
                </FadeUp>

                {/* Enquiry form */}
                <FadeUp delay={0.08}>
                  <div className="border border-[#371628]/10 p-7 bg-white">
                    <Eyebrow>Enquire About This Property</Eyebrow>
                    <p className="font-serif text-[#2a1f25] mt-3 mb-6 leading-snug" style={{ fontSize: "1.1rem" }}>
                      {listing.address}, {listing.suburb}
                    </p>
                    <EnquiryForm
                      address={`${listing.address}, ${listing.suburb}`}
                      agentName={agentName.split(" ")[0]}
                    />
                  </div>
                </FadeUp>

                {/* Location */}
                <FadeUp delay={0.14}>
                  <div className="border border-[#371628]/10 p-5 flex items-center gap-4 bg-white">
                    <div className="w-9 h-9 bg-[#371628]/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#371628]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-sans font-medium text-[#2a1f25]/80 text-sm">{listing.suburb}, {listing.state}</p>
                      <p className="text-[10px] text-[#371628]/35 font-sans">Geelong Region, Victoria</p>
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE LISTINGS ── */}
      <section className="py-20 border-t border-[#371628]/8 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Continue Browsing</Eyebrow>
              <h2 className="font-serif text-[#2a1f25] mt-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400 }}>
                More Properties
              </h2>
            </div>
            <Link href="/listings">
              <button className="hidden md:flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.35em] font-sans text-[#371628]/38 hover:text-[#371628] transition-colors">
                All Listings <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </FadeUp>
          <Link href="/listings">
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] font-sans text-[#371628] hover:opacity-60 transition-opacity md:hidden mb-8">
              View All Listings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages} current={lightboxIdx}
          onClose={closeLightbox} onPrev={prevImg} onNext={nextImg}
        />
      )}
    </div>
  );
}
