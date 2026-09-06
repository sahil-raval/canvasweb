import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/data/journal";
import { useCms } from "@/lib/cms";

const CATEGORIES = ["All", "Market Insights", "Buying Guide", "Lifestyle", "Design"];

const TICKER_ITEMS = [
  "Market Insights", "·", "Lifestyle", "·", "Buying Guide", "·",
  "Design", "·", "Property", "·", "Geelong", "·",
];

/* ─── Eyebrow label ─────────────────────────────────────── */
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`text-[9px] uppercase tracking-[0.55em] font-semibold font-sans block ${light ? "text-white/35" : "text-[#371628]/35"}`}>
      {children}
    </span>
  );
}

/* ─── Animation helper ──────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Marquee tape ──────────────────────────────────────── */
function MarqueeTape() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-5 border-y border-[#371628]/8 my-24 select-none">
      <motion.div
        className="flex gap-10 whitespace-nowrap w-max"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`font-sans text-[8.5px] uppercase tracking-[0.65em] font-medium ${
              item === "·" ? "text-[#371628]/15" : "text-[#371628]/28"
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Category filter — editorial underline style ───────── */
function CategoryFilter({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center gap-0 border-b border-[#371628]/10 pb-0">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="relative px-5 py-3 text-[9px] uppercase tracking-[0.45em] font-semibold font-sans transition-colors duration-300 group"
          style={{ color: active === cat ? "#371628" : "rgba(55,22,40,0.35)" }}
        >
          {cat}
          {active === cat && (
            <motion.div
              layoutId="cat-underline"
              className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#371628]"
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#371628]/0 group-hover:bg-[#371628]/15 transition-colors duration-300" />
        </button>
      ))}
    </div>
  );
}

/* ─── Featured card (editorial split) ──────────────────── */
function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group">
      <div className="grid lg:grid-cols-5 gap-0 overflow-hidden min-h-[580px] border border-[#371628]/8">

        {/* Image — 3/5 */}
        <div className="lg:col-span-3 relative overflow-hidden">
          <motion.img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e0d16]/60 via-transparent to-transparent lg:hidden" />

          {/* Category pill */}
          <div className="absolute top-8 left-8">
            <span
              className="inline-block text-white text-[8px] uppercase tracking-[0.5em] font-semibold font-sans px-4 py-2"
              style={{ background: "rgba(55,22,40,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {article.category}
            </span>
          </div>

          {/* "Featured" vertical label */}
          <div className="absolute right-0 top-0 bottom-0 w-10 hidden lg:flex items-center justify-center border-l border-white/6">
            <span
              className="font-sans text-[7px] uppercase tracking-[0.65em] font-semibold text-white/18 whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Featured Story
            </span>
          </div>
        </div>

        {/* Copy — 2/5, wine bg */}
        <div className="lg:col-span-2 bg-[#371628] flex flex-col justify-between px-10 py-16 relative overflow-hidden">
          {/* Decorative giant numeral */}
          <span
            className="absolute -right-4 -bottom-6 font-serif text-white/[0.04] select-none pointer-events-none leading-none"
            style={{ fontSize: "15rem" }}
          >
            01
          </span>

          <div className="relative space-y-6">
            <Eyebrow light>{article.date}</Eyebrow>

            <h2
              className="font-serif font-normal text-[#FAF8F5] leading-[1.08] group-hover:text-white transition-colors duration-500"
              style={{ fontSize: "clamp(1.55rem, 2.3vw, 2.3rem)" }}
            >
              {article.title}
            </h2>

            {/* Separator */}
            <div className="w-8 h-px bg-white/20" />

            {/* Pull line from excerpt — italic serif */}
            <p
              className="font-serif italic text-[#FAF8F5]/40 leading-[1.6]"
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.02rem)" }}
            >
              "{article.excerpt.split(".")[0]}."
            </p>
          </div>

          <div className="relative flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/22" />
              <span className="text-white/25 text-[9px] font-sans tracking-wide">{article.readTime} min read</span>
            </div>
            <div
              className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:bg-white/8 group-hover:border-white/30 transition-all duration-500"
            >
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Portrait card (tall, left column of asymmetric trio) */
function PortraitCard({ article, num }: { article: Article; num: number }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group h-full">
      <div className="relative h-full overflow-hidden" style={{ minHeight: "520px" }}>
        <motion.img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e0d16] via-[#1e0d16]/25 to-transparent" />

        {/* Decorative ordinal */}
        <span
          className="absolute right-6 top-6 font-serif text-white/[0.08] select-none pointer-events-none leading-none"
          style={{ fontSize: "5rem" }}
        >
          {String(num).padStart(2, "0")}
        </span>

        {/* Content pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-9">
          <span
            className="inline-block text-white text-[8px] uppercase tracking-[0.45em] font-semibold font-sans px-3.5 py-1.5 mb-5"
            style={{ background: "rgba(250,248,245,0.1)", border: "1px solid rgba(250,248,245,0.14)" }}
          >
            {article.category}
          </span>
          <h3
            className="font-serif font-normal text-[#FAF8F5] leading-[1.1] mb-6 group-hover:text-white transition-colors duration-400"
            style={{ fontSize: "clamp(1.25rem, 2.1vw, 1.7rem)" }}
          >
            {article.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/28" />
              <span className="text-white/32 text-[9px] font-sans tracking-wide">{article.readTime} min read</span>
            </div>
            <motion.div
              className="w-9 h-9 border border-white/15 flex items-center justify-center"
              whileHover={{ borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-white/45 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Landscape card (right column, stacked) ────────────── */
function LandscapeCard({ article, num }: { article: Article; num: number }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group flex-1">
      <div className="flex gap-6 items-start h-full py-7 border-b border-[#371628]/8 last:border-0">
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ width: "140px", height: "108px" }}>
          <motion.img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Eyebrow>{article.category}</Eyebrow>
              <span className="font-serif text-[#371628]/12 text-base select-none">{String(num).padStart(2, "0")}</span>
            </div>
            <h3
              className="font-serif font-normal text-[#2a1f25] group-hover:text-[#371628] transition-colors duration-300 leading-[1.2] mb-3"
              style={{ fontSize: "clamp(0.98rem, 1.3vw, 1.12rem)" }}
            >
              {article.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <Clock className="w-2.5 h-2.5 text-[#371628]/28" />
            <span className="text-[9px] text-[#371628]/30 font-sans">{article.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Text-only feature card (full width, wine bg) ──────── */
function TextFeatureCard({ article, num }: { article: Article; num: number }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group">
      <div className="relative bg-[#371628] overflow-hidden px-12 md:px-24 py-20 md:py-24">
        {/* Giant faded numeral */}
        <span
          className="absolute -right-2 top-1/2 -translate-y-1/2 font-serif text-white/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "24rem" }}
        >
          {String(num).padStart(2, "0")}
        </span>

        {/* Top + bottom rules */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/8" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-5 mb-10">
            <span
              className="text-white text-[8px] uppercase tracking-[0.55em] font-semibold font-sans px-4 py-2"
              style={{ border: "1px solid rgba(250,248,245,0.14)" }}
            >
              {article.category}
            </span>
            <div className="flex-1 h-px bg-white/8" />
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/22" />
              <span className="text-white/25 text-[9px] font-sans">{article.readTime} min read</span>
            </div>
          </div>

          <h2
            className="font-serif font-normal text-[#FAF8F5] leading-[1.08] mb-9 group-hover:text-white transition-colors duration-500"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.2rem)" }}
          >
            {article.title}
          </h2>

          <p className="font-sans text-[#FAF8F5]/38 leading-[1.8] mb-12 max-w-xl" style={{ fontSize: "0.95rem" }}>
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
            <span className="text-[9px] uppercase tracking-[0.5em] font-semibold font-sans text-white/38 group-hover:text-white/75 transition-colors duration-300">
              Read Article
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/32 group-hover:text-white/75 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Standard grid card ────────────────────────────────── */
function GridCard({ article, num }: { article: Article; num: number }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group h-full">
      <div className="h-full flex flex-col">
        <div className="relative overflow-hidden mb-7" style={{ height: "290px" }}>
          <motion.img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#371628]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-6 left-6">
            <span
              className="inline-block text-white text-[8px] uppercase tracking-[0.45em] font-semibold font-sans px-3.5 py-1.5"
              style={{ background: "rgba(55,22,40,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {article.category}
            </span>
          </div>
          <span
            className="absolute bottom-5 right-5 font-serif text-white/[0.15] select-none leading-none"
            style={{ fontSize: "3.5rem" }}
          >
            {String(num).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col flex-1">
          <Eyebrow>{article.date}</Eyebrow>
          <h3
            className="font-serif font-normal text-[#2a1f25] group-hover:text-[#371628] transition-colors duration-400 leading-[1.18] mt-3 mb-4 flex-1"
            style={{ fontSize: "clamp(1.02rem, 1.5vw, 1.22rem)" }}
          >
            {article.title}
          </h3>
          <p className="text-[#371628]/42 font-sans leading-[1.75] line-clamp-2 mb-6" style={{ fontSize: "0.875rem" }}>
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2.5 text-[#371628]">
            <span className="text-[8.5px] uppercase tracking-[0.4em] font-semibold font-sans opacity-40 group-hover:opacity-100 transition-opacity duration-300">
              Read Article
            </span>
            <ArrowRight className="w-3 h-3 opacity-38 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
function Hero({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section
      className="relative pt-36 pb-20 overflow-hidden"
      style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
    >
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "180px",
      }} />

      {/* Faint right-side glow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-10"
        style={{ background: "radial-gradient(ellipse at 80% 40%, #6b2548 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <motion.p
          className="text-[9px] uppercase tracking-[0.65em] text-white/35 font-semibold font-sans mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {eyebrow || "Canvas Real Estate"}
        </motion.p>

        <motion.h1
          className="font-serif font-normal text-[#FAF8F5] leading-[1.04] mb-6"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "-0.015em" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {heading || "The Journal"}
        </motion.h1>

        <motion.div
          className="w-10 h-px bg-white/20 mb-6"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        <motion.p
          className="text-white/45 font-sans leading-[1.75] max-w-md"
          style={{ fontSize: "0.95rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
        >
          {intro || "Perspectives on property, place, and the art of living well"}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function Journal() {
  const { articles, pages } = useCms();
  const page = pages.find((item) => item.slug === "journal");
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = articles.find(a => a.featured) ?? articles[0];
  const secondary = articles.filter(a => a !== featured);
  const filtered  = activeCategory === "All"
    ? secondary
    : secondary.filter(a => a.category === activeCategory);

  const isAll     = activeCategory === "All";
  const [a0, a1, a2, a3, a4] = filtered;

  if (!featured) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <Hero eyebrow={page?.eyebrow} heading={page?.heading} intro={page?.intro} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-24 text-center">
          <h2 className="font-serif text-3xl text-[#371628]">No journal articles published yet</h2>
          <p className="mt-4 text-[#371628]/55">Published stories from Sanity will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <Hero eyebrow={page?.eyebrow} heading={page?.heading} intro={page?.intro} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-36">

        {/* ── Featured ── */}
        <FadeUp className="mb-5">
          <Eyebrow>Featured Story</Eyebrow>
        </FadeUp>
        <FadeUp>
          <FeaturedCard article={featured} />
        </FadeUp>

        {/* ── Marquee ── */}
        <MarqueeTape />

        {/* ── Category filter ── */}
        <FadeUp className="mb-16">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </FadeUp>

        {/* ── Editorial layout when "All" is selected and we have 5 articles ── */}
        {isAll && filtered.length >= 5 ? (
          <div className="space-y-10">

            {/* BLOCK A — Asymmetric: tall portrait left + two stacked landscape right */}
            <FadeUp>
              <div className="flex flex-col lg:flex-row gap-0 border border-[#371628]/8" style={{ minHeight: "520px" }}>
                {/* Left — tall portrait */}
                <div className="lg:w-[58%] border-b lg:border-b-0 lg:border-r border-[#371628]/8">
                  <PortraitCard article={a0} num={1} />
                </div>
                {/* Right — two stacked landscape */}
                <div className="lg:w-[42%] flex flex-col divide-y divide-[#371628]/8 px-8 py-2">
                  <LandscapeCard article={a1} num={2} />
                  <LandscapeCard article={a2} num={3} />
                </div>
              </div>
            </FadeUp>

            {/* BLOCK B — Full-width text feature (wine, no image) */}
            {a3 && (
              <FadeUp>
                <TextFeatureCard article={a3} num={4} />
              </FadeUp>
            )}

            {/* BLOCK C — 2-col grid for remaining */}
            {a4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#371628]/8">
                <FadeUp className="border-b md:border-b-0 md:border-r border-[#371628]/8 p-10">
                  <GridCard article={a4} num={5} />
                </FadeUp>
                <FadeUp delay={0.07}>
                  <div className="flex flex-col justify-center px-10 py-12 h-full">
                    <Eyebrow>Explore further</Eyebrow>
                    <p
                      className="font-serif font-normal text-[#371628] leading-[1.22] mt-5 mb-5"
                      style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.5rem)" }}
                    >
                      Ready to start your Geelong property journey?
                    </p>
                    <div className="w-8 h-px bg-[#371628]/20 mb-5" />
                    <p className="text-[#371628]/45 font-sans leading-[1.78] mb-9" style={{ fontSize: "0.875rem" }}>
                      Our team is on the ground, everyday, watching the market move. Let us guide you.
                    </p>
                    <Link href="/contact">
                      <button className="inline-flex items-center gap-3 bg-[#371628] text-white font-sans font-semibold text-[13px] px-8 py-3.5 hover:bg-[#2d1020] transition-colors w-fit tracking-wide">
                        Get in touch <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </FadeUp>
              </div>
            )}
          </div>
        ) : (
          /* ── Filtered / fallback: standard 3-col grid ── */
          filtered.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-serif text-2xl text-[#371628]/25">No articles in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filtered.map((article, i) => (
                <FadeUp key={article.slug} delay={i * 0.07}>
                  <GridCard article={article} num={i + 1} />
                </FadeUp>
              ))}
            </div>
          )
        )}

        {/* ── Footer rule ── */}
        <div className="mt-32 pt-10 border-t border-[#371628]/8 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="font-sans text-[8.5px] text-[#371628]/22 tracking-[0.4em] uppercase">
            Canvas Real Estate · Geelong · Est. 2015
          </p>
          <Link href="/contact">
            <button className="text-[8.5px] uppercase tracking-[0.45em] font-semibold font-sans text-[#371628]/35 hover:text-[#371628] transition-colors duration-300 border-b border-[#371628]/15 hover:border-[#371628]/45 pb-0.5">
              Speak with our team
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
