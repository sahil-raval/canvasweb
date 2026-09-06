/**
 * About.tsx — Canvas Real Estate · Showstopper Edition
 *
 * Sections:
 *  1  HERO          — full-viewport team photo, "About Us" bottom-left (Olivia Harper)
 *  2  MANIFESTO     — word-by-word scroll reveal of the brand statement
 *  3  NUMBERS       — animated count-up strip on wine background
 *  4  POOJA         — full-height split panel, mouse-parallax portrait, wine right
 *  5  CHANDRA       — full-height split panel (flipped), mouse-parallax portrait
 *  6  MARQUEE       — continuous wine ticker strip
 *  7  VALUES        — numbered list with hover image reveal
 *  8  GALLERY       — asymmetric editorial grid
 *  9  CTA           — magnetic button, agent cards, dark wine
 */

import {
  useRef, useState, useCallback,
} from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useMotionTemplate,
} from "framer-motion";
import { Link } from "wouter";
import { Phone, Mail, ArrowRight } from "lucide-react";

import teamImg   from "@/assets/canvas/agent-team.jpg";
import poojaImg  from "@/assets/canvas/agent-pooja-new.jpg";
import chandraImg from "@/assets/canvas/agent-chandra-new.jpg";
import office1   from "@/assets/canvas/office-1.jpg";
import office2   from "@/assets/canvas/office-2.jpg";
import office3   from "@/assets/canvas/office-3.jpg";
import office4   from "@/assets/canvas/office-4.jpg";
import { useCms } from "@/lib/cms";

/* ─────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────── */

/** Thin horizontal rule */
function HR({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-[#d6cfc9] ${className}`} />;
}

/** Heading wipe-up — wraps in overflow:hidden so child slides up from below */
function HeadingReveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Simple fade-up helper */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Animated number counter — counts up when it enters the viewport */
/** Magnetic button — subtly follows cursor */
function MagneticBtn({ children, href, className = "" }: {
  children: React.ReactNode; href: string; className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width  / 2) * 0.28);
    my.set((e.clientY - r.top  - r.height / 2) * 0.28);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <Link href={href}>
      <motion.button
        ref={ref}
        style={{ x: sx, y: sy }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {children}
      </motion.button>
    </Link>
  );
}

/** Agent split-panel with mouse parallax on portrait */
function AgentPanel({
  img, imgPosition = "object-top", name, role, num, bio, flip,
}: {
  img: string;
  imgPosition?: string;
  name: string;
  role: string;
  num: string;
  bio: string[];
  flip?: boolean;
}) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width  - 0.5) * 40);
    my.set(((e.clientY - r.top)  / r.height - 0.5) * 28);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const photoPanelBg   = flip ? "bg-[#FAF8F5]"  : "bg-[#371628]";
  const contentBg      = flip ? "bg-[#371628]"  : "bg-[#FAF8F5]";
  const headingColor   = flip ? "text-white"     : "text-gray-900";
  const bodyColor      = flip ? "text-white/65"  : "text-gray-500";
  const ruleColor      = flip ? "bg-white/20"    : "bg-[#d6cfc9]";
  const eyebrowColor   = flip ? "text-white/40"  : "text-[#371628]/50";
  const linkColor      = flip ? "text-white/80 hover:text-white" : "text-[#371628]/80 hover:text-[#371628]";
  const numColor       = flip ? "text-white/5"   : "text-[#371628]/5";

  const photoOrder  = flip ? "lg:order-2" : "lg:order-1";
  const contentOrder = flip ? "lg:order-1" : "lg:order-2";

  return (
    <section
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex flex-col lg:flex-row lg:min-h-screen"
    >
      {/* ── PHOTO HALF ── */}
      <div className={`relative w-full lg:w-1/2 flex items-center justify-center py-10 px-6 md:py-16 md:px-10 lg:py-20 lg:px-14 ${photoPanelBg} ${photoOrder}`}>
        {/* Floating card */}
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: "clamp(300px, 70vw, 640px)",
            boxShadow: flip
              ? "0 48px 96px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)"
              : "0 48px 96px rgba(55,22,40,0.38), 0 16px 40px rgba(55,22,40,0.22), 0 0 0 1px rgba(55,22,40,0.08)",
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.img
            src={img}
            alt={name}
            style={{ x: sx, y: sy, scale: 1.08 }}
            className={`absolute inset-0 w-full h-full object-cover ${imgPosition}`}
          />
          {/* subtle inset vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.18)" }} />
        </motion.div>
      </div>

      {/* ── CONTENT HALF ── */}
      <div className={`relative w-full lg:w-1/2 flex items-center px-6 md:px-12 lg:px-20 py-14 lg:py-20 ${contentBg} ${contentOrder}`}>
        {/* Decorative large number — desktop only */}
        <span
          className={`absolute top-10 right-10 font-serif font-normal select-none pointer-events-none leading-none hidden lg:block ${numColor}`}
          style={{ fontSize: "clamp(7rem, 14vw, 14rem)" }}
        >
          {num}
        </span>

        <div className="relative z-10 max-w-md">
          <FadeUp>
            <p className={`text-xs uppercase tracking-[0.35em] font-semibold font-sans mb-5 ${eyebrowColor}`}>{role}</p>
          </FadeUp>

          <HeadingReveal delay={0.05}>
            <h2 className={`font-serif font-normal leading-[1.05] mb-7 ${headingColor}`}
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
              {name}
            </h2>
          </HeadingReveal>

          <FadeUp delay={0.1}>
            <div className={`h-px w-14 mb-8 ${ruleColor}`} />
          </FadeUp>

          <div className="space-y-5">
            {bio.map((p, i) => (
              <FadeUp key={i} delay={0.12 + i * 0.08}>
                <p className={`font-sans text-sm leading-relaxed ${bodyColor}`}>{p}</p>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.35} className="flex flex-wrap gap-6 mt-10">
            <a href="tel:0469131347"
              className={`flex items-center gap-2.5 text-sm font-medium font-sans transition-colors ${linkColor}`}>
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              0469 131 347
            </a>
            <a href={`mailto:${name === "Pooja Patel" ? "ppatel" : "cbhatt"}@canvasrealestate.com.au`}
              className={`flex items-center gap-2.5 text-sm font-medium font-sans transition-colors ${linkColor}`}>
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              {`Email ${name.split(" ")[0]}`}
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MANIFESTO — cursor-spotlight dark chamber
   Move cursor across the screen to illuminate the belief.
───────────────────────────────────────────────────────────── */
function ManifestoSection({ words }: { words: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorX = useMotionValue(-800);
  const cursorY = useMotionValue(-800);
  const cx = useSpring(cursorX, { stiffness: 160, damping: 28 });
  const cy = useSpring(cursorY, { stiffness: 160, damping: 28 });

  /* Wine overlay with a circular hole that follows the cursor */
  const maskImage = useMotionTemplate`radial-gradient(circle 300px at ${cx}px ${cy}px, transparent 0%, rgba(55,22,40,0.97) 62%)`;

  /* Brand colours */
  const BG      = "#2d1122";           // deep wine — slightly deeper than #371628 for richness
  const BG_GRAD = `linear-gradient(160deg, #341425 0%, ${BG} 50%, #2a0f1e 100%)`;

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    cursorX.set(e.clientX - r.left);
    cursorY.set(e.clientY - r.top);
  }, [cursorX, cursorY]);

  const onLeave = useCallback(() => {
    cursorX.set(-800);
    cursorY.set(-800);
  }, [cursorX, cursorY]);

  /* Split into lines for a staggered reveal on scroll */
  const lines = [
    words.slice(0, 6).join(" "),   // "We believe real estate is not"
    words.slice(6, 10).join(" "),  // "simply about property."
    words.slice(10, 14).join(" "), // "It is about the"
    words.slice(14, 18).join(" "), // "lives, the memories,"
    words.slice(18).join(" "),     // "and the futures taking shape within those walls."
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none px-5 md:px-0"
      style={{ background: BG_GRAD }}
    >
      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045]" aria-hidden>
        <filter id="manifesto-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#manifesto-grain)" />
      </svg>

      {/* Warm cream radial glow — softens the centre of the wine bg */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800, height: 800,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(250,230,215,0.06) 0%, rgba(200,140,110,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Thin vertical side rules — cream at very low opacity */}
      <div className="absolute top-0 bottom-0 left-14 w-px bg-[#FAF8F5]/[0.06] pointer-events-none hidden md:block" />
      <div className="absolute top-0 bottom-0 right-14 w-px bg-[#FAF8F5]/[0.06] pointer-events-none hidden md:block" />

      {/* Corner marks — cream */}
      {(["tl","tr","bl","br"] as const).map(p => (
        <motion.div
          key={p}
          className={[
            "absolute w-6 h-6 pointer-events-none",
            "border-[#FAF8F5]/20",
            p === "tl" ? "top-10 left-10 border-t border-l" : "",
            p === "tr" ? "top-10 right-10 border-t border-r" : "",
            p === "bl" ? "bottom-10 left-10 border-b border-l" : "",
            p === "br" ? "bottom-10 right-10 border-b border-r" : "",
          ].join(" ")}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      ))}

      {/* Section number — cream ghosted background */}
      <span
        className="absolute right-10 bottom-16 font-serif font-normal leading-none pointer-events-none hidden md:block"
        style={{ fontSize: "clamp(8rem, 16vw, 18rem)", color: "rgba(250,248,245,0.04)" }}
      >02</span>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 text-center">

        {/* Eyebrow */}
        <motion.p
          className="text-[9px] uppercase tracking-[0.45em] font-sans font-semibold mb-16"
          style={{ color: "rgba(250,248,245,0.35)" }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
        >
          Our Belief
        </motion.p>

        {/* Quote — dim base always visible (cream at low opacity on wine) */}
        <div className="relative">
          {/* Dim layer */}
          <div aria-hidden className="pointer-events-none">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <p
                  className="font-serif font-normal leading-[1.18] mb-1"
                  style={{ fontSize: "clamp(1.9rem, 4.2vw, 5rem)", color: "rgba(250,248,245,0.14)" }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Bright layer — cream, revealed by spotlight */}
          <div className="absolute inset-0 pointer-events-none">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.p
                  className="font-serif font-normal leading-[1.18] mb-1"
                  style={{ fontSize: "clamp(1.9rem, 4.2vw, 5rem)", color: "#FAF8F5" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.0, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        {/* Rule + caption */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.0, delay: 0.6 }}
        >
          <div className="w-16 h-px" style={{ background: "rgba(250,248,245,0.2)" }} />
          <p
            className="text-[9px] uppercase tracking-[0.45em] font-sans"
            style={{ color: "rgba(250,248,245,0.28)" }}
          >
            canvas real estate · geelong · independent since 2015
          </p>
        </motion.div>

        {/* Hint */}
        <motion.p
          className="mt-12 text-[9px] uppercase tracking-[0.4em] font-sans hidden md:block"
          style={{ color: "rgba(250,248,245,0.22)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Move your cursor to illuminate
        </motion.p>
      </div>

      {/* ── CURSOR SPOTLIGHT OVERLAY — wine bg with cursor hole ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <div className="absolute inset-0" style={{ background: BG_GRAD }} />
      </motion.div>

      {/* Cursor glow — warm cream bloom */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 160,
          height: 160,
          x: cx,
          y: cy,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(250,220,190,0.12) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function About() {
  const { pages, agents } = useCms();
  const page = pages.find((item) => item.slug === "about");
  /* Values hover state */
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const values = [
    { num: "01", title: "Transparency",    desc: "No hidden agendas, no ambiguity. You'll always know exactly where you stand, from first meeting to final settlement.", img: office1 },
    { num: "02", title: "Integrity",        desc: "We act in your best interest, always. Our advice is grounded in honesty, even when it is not what you want to hear.",  img: office2 },
    { num: "03", title: "Local Expertise",  desc: "We know Geelong's suburbs, schools, streets and market dynamics with a depth that only comes from truly living here.",  img: office3 },
    { num: "04", title: "Personal Touch",   desc: "Every client is different. We take the time to understand your unique goals and tailor our approach accordingly.",      img: office4 },
  ];

  /* Manifesto words */
  const manifesto = "We believe real estate is not simply about property. It is about the lives, the memories, and the futures taking shape within those walls.";
  const words = manifesto.split(" ");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          01 · HERO
      ══════════════════════════════════════════ */}
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
            {page?.heading || "About Us"}
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
            {page?.intro || "Committed to delivering exceptional property outcomes through honest advice, genuine care, and deep local knowledge."}
          </motion.p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          04 · POOJA — photo left, wine right
      ══════════════════════════════════════════ */}
      <AgentPanel
        img={poojaImg}
        imgPosition="object-top"
        name="Pooja Patel"
        role="Director & Founder"
        num="01"
        flip={false}
        bio={[
          "Pooja Patel is part of a new wave of real estate professionals: dynamic, community-minded, and deeply invested in the region she serves. As Director of Canvas Real Estate, Pooja brings a fresh, client-focused approach to the Geelong property market.",
          "Her business is proudly local and independent, built on strong relationships, clear communication, and tailored marketing strategies. With a background spanning IT and real estate, Pooja blends modern technology with genuine industry insight to deliver standout results.",
          "Having moved to Australia as a teenager and grown up in Geelong, Pooja has a deep, personal connection to the community she serves every day. That connection shows in every result she achieves.",
        ]}
      />

      {/* ══════════════════════════════════════════
          05 · CHANDRA — cream left, photo right
      ══════════════════════════════════════════ */}
      <AgentPanel
        img={chandraImg}
        imgPosition="object-top"
        name="Chandra Bhatt"
        role="Director & Co-Founder"
        num="02"
        flip={true}
        bio={[
          "Chandrakant (Chandra) Bhatt blends over a decade of industry experience with deep practical knowledge of home building and design, offering clients clear, grounded advice at every stage of their property journey.",
          "As Director of Canvas Real Estate, Chandra brings a background in residential construction, design functionality, and client service, giving him a unique edge in guiding buyers and sellers with confidence, care, and exceptional insight.",
          "With a strong history as a Senior New Home Sales Consultant, Chandra has guided hundreds of clients through complex decisions. That expertise gives every Canvas client an unparalleled advantage in Geelong's market.",
        ]}
      />

      {/* ══════════════════════════════════════════
          06 · MARQUEE — continuous wine ticker
      ══════════════════════════════════════════ */}
      <div className="overflow-hidden bg-[#371628] py-5 border-y border-white/5">
        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          {[0, 1].map(k => (
            <div key={k} className="flex items-center shrink-0">
              {["CANVAS REAL ESTATE", "GEELONG VICTORIA", "INDEPENDENT AGENCY", "5.0 GOOGLE RATING", "LOCALLY TRUSTED", "BOUTIQUE SERVICE", "HONEST ADVICE", "GENUINE CARE"].map((item, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="text-white/55 text-[10px] font-semibold tracking-[0.4em] uppercase font-sans px-8 whitespace-nowrap">
                    {item}
                  </span>
                  <span className="text-white/20 text-base">·</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          07 · VALUES — hover image reveal
      ══════════════════════════════════════════ */}
      <section className="py-32 md:py-44 bg-white">
        <div className="max-w-6xl mx-auto px-8 md:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

            {/* Left — sticky heading + hover image */}
            <div className="lg:col-span-4 lg:sticky lg:top-36">
              <FadeUp>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#371628]/40 font-semibold font-sans mb-6">
                  What We Stand For
                </p>
              </FadeUp>

              {/* Mobile: plain heading */}
              <div className="lg:hidden mb-2">
                <HeadingReveal>
                  <h2 className="font-serif font-normal text-gray-900 leading-[1.0]"
                    style={{ fontSize: "clamp(2rem, 8vw, 3.2rem)" }}>
                    OUR CORE<br />VALUES
                  </h2>
                </HeadingReveal>
                <HR className="mt-6 w-14" />
              </div>

              {/* Desktop: fixed-height slot with heading + hover image crossfade */}
              <div className="relative w-full hidden lg:block" style={{ height: "clamp(440px, 56vw, 680px)" }}>
                {/* Heading — fades out on hover */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-start"
                  animate={{ opacity: hoveredValue !== null ? 0 : 1, y: hoveredValue !== null ? -10 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <HeadingReveal>
                    <h2 className="font-serif font-normal text-gray-900 leading-[1.0]"
                      style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                      OUR CORE<br />VALUES
                    </h2>
                  </HeadingReveal>
                  <HR className="mt-8 w-14" />
                </motion.div>

                {/* Hover image — fills the same slot */}
                <AnimatePresence>
                  {hoveredValue !== null && (
                    <motion.div
                      key={hoveredValue}
                      initial={{ opacity: 0, scale: 0.96, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl shadow-[#371628]/20"
                    >
                      <img
                        src={values[hoveredValue].img}
                        alt={values[hoveredValue].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#371628]/65 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5">
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.35em] font-sans">{values[hoveredValue].num}</p>
                        <p className="text-white font-serif font-normal text-xl mt-1">{values[hoveredValue].title}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right — numbered value list */}
            <div className="lg:col-span-8 space-y-0">
              {values.map(({ num, title, desc, img }, i) => (
                <FadeUp key={num} delay={i * 0.07}>
                  <div
                    className="group py-9 border-b border-[#ece8e4] cursor-default"
                    onMouseEnter={() => setHoveredValue(i)}
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    <div className="flex gap-8 items-start">
                      {/* Number */}
                      <span className="text-[10px] text-[#371628]/30 font-semibold tracking-[0.3em] font-sans pt-1 shrink-0 w-7">
                        {num}
                      </span>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <motion.h3
                            className="font-serif font-normal text-gray-900 group-hover:text-[#371628] transition-colors duration-300"
                            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.8rem)" }}
                          >
                            {title}
                          </motion.h3>
                          <motion.div
                            className="w-8 h-8 rounded-full border border-[#371628]/15 flex items-center justify-center opacity-0 group-hover:opacity-100 shrink-0 transition-opacity duration-300"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#371628]/60" />
                          </motion.div>
                        </div>
                        <motion.p
                          className="text-gray-400 font-sans text-sm leading-relaxed mt-3 max-w-xl"
                          initial={{ height: "auto" }}
                        >
                          {desc}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          08 · GALLERY — asymmetric editorial grid
      ══════════════════════════════════════════ */}
      <section className="py-28 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-8 md:px-14">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <FadeUp>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#371628]/40 font-semibold font-sans mb-5">
                  Our Space
                </p>
              </FadeUp>
              <HeadingReveal>
                <h2 className="font-serif font-normal text-gray-900"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                  WHERE WE WORK
                </h2>
              </HeadingReveal>
            </div>
            <FadeUp delay={0.1}>
              <p className="text-gray-400 font-sans text-sm max-w-sm leading-relaxed text-right">
                Our Geelong studio is where strategy meets creativity, a space built for the focused work of helping people achieve extraordinary outcomes.
              </p>
            </FadeUp>
          </div>

          {/* Asymmetric grid — stacked on mobile, editorial on md+ */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:grid-rows-[320px_320px]">
            <FadeUp className="w-full h-[260px] md:h-auto md:col-span-7 md:row-span-2 overflow-hidden rounded-sm group" delay={0}>
              <img src={office1} alt="Canvas office" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
            </FadeUp>
            <FadeUp className="w-full h-[220px] md:h-auto md:col-span-5 md:row-span-1 overflow-hidden rounded-sm group" delay={0.08}>
              <img src={office2} alt="Canvas team" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
            </FadeUp>
            <div className="col-span-12 md:col-span-5 md:row-span-1 grid grid-cols-2 gap-3 h-[220px] md:h-auto">
              <FadeUp className="col-span-1 overflow-hidden rounded-sm group h-full" delay={0.14}>
                <img src={office3} alt="Canvas workspace" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </FadeUp>
              <FadeUp className="col-span-1 overflow-hidden rounded-sm group h-full" delay={0.2}>
                <img src={office4} alt="Canvas detail" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          09 · CTA — magnetic button, agent cards
      ══════════════════════════════════════════ */}
      <section
        className="relative py-36 md:py-48 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 60%, #2d1020 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-white/[0.025] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.025] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Film grain */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
          <filter id="cta-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cta-grain)" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-14 text-center">
          <FadeUp>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold font-sans mb-8">
              Begin Your Journey
            </p>
          </FadeUp>

          <HeadingReveal>
            <h2 className="font-serif font-normal text-white leading-[1.05] mb-8"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}>
              Let's write your<br />Geelong story.
            </h2>
          </HeadingReveal>

          <FadeUp delay={0.15}>
            <p className="text-white/50 font-sans text-base leading-relaxed mb-14 max-w-xl mx-auto">
              Book a free, no-obligation consultation and discover how Canvas Real Estate can deliver exceptional results for your property journey.
            </p>
          </FadeUp>

          {/* Magnetic button */}
          <FadeUp delay={0.25}>
            <div className="flex justify-center mb-20">
              <MagneticBtn
                href="/contact"
                className="group relative inline-flex items-center gap-3 bg-white text-[#371628] font-bold font-sans text-sm uppercase tracking-[0.22em] px-12 py-5 rounded-full hover:bg-[#FAF8F5] active:scale-[0.97] transition-colors duration-300 shadow-2xl shadow-black/30"
              >
                Book Free Consultation
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </MagneticBtn>
            </div>
          </FadeUp>

          {/* Agent cards */}
          <FadeUp delay={0.35}>
            <div className="flex justify-center gap-4 flex-wrap">
              {(agents.length > 0 ? agents.map((agent) => ({
                img: agent.photo || (agent.key === "pooja" ? poojaImg : chandraImg),
                name: agent.name,
                role: agent.role || "Agent",
              })) : [
                { img: poojaImg,   name: "Pooja Patel",   role: "Director & Founder" },
                { img: chandraImg, name: "Chandra Bhatt",  role: "Director & Co-Founder" },
              ]).map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3"
                >
                  <img
                    src={a.img}
                    alt={a.name}
                    className="w-10 h-10 rounded-full object-cover object-top shrink-0"
                  />
                  <div className="text-left">
                    <p className="text-white font-serif font-normal text-sm">{a.name}</p>
                    <p className="text-white/45 font-sans text-[10px]">{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
