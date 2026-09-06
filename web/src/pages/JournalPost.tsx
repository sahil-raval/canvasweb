import { useRef } from "react";
import { Link, useParams } from "wouter";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import type { Article, BlockType } from "@/data/journal";
import { useCms } from "@/lib/cms";

/* ─── Reading progress bar ──────────────────────────────── */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] origin-left"
      style={{ scaleX, height: "1.5px", background: "#371628" }}
    />
  );
}

/* ─── Eyebrow ────────────────────────────────────────────── */
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`text-[8.5px] uppercase tracking-[0.6em] font-semibold font-sans block ${light ? "text-white/30" : "text-[#371628]/32"}`}>
      {children}
    </span>
  );
}

/* ─── Drop-cap paragraph ─────────────────────────────────── */
function DropCapParagraph({ text }: { text: string }) {
  const first = text[0];
  const rest  = text.slice(1);
  return (
    <p className="font-sans text-[#2a1f25]/68 leading-[1.95] mb-8 overflow-hidden" style={{ fontSize: "1.05rem" }}>
      <span
        className="float-left font-serif text-[#371628] mr-3 select-none leading-none"
        style={{ fontSize: "5.8rem", lineHeight: 0.78, marginTop: "0.1em" }}
      >
        {first}
      </span>
      {rest}
    </p>
  );
}

/* ─── Body paragraph ─────────────────────────────────────── */
function Paragraph({ text }: { text: string }) {
  return (
    <p className="font-sans text-[#2a1f25]/65 leading-[1.95] mb-8" style={{ fontSize: "1.05rem" }}>
      {text}
    </p>
  );
}

/* ─── Section heading ────────────────────────────────────── */
function SectionHeading({ text, num }: { text: string; num: number }) {
  return (
    <div className="relative mt-20 mb-8">
      {/* Floating ordinal — visible on large screens, outside column */}
      <span
        className="absolute font-serif text-[#371628]/[0.055] select-none pointer-events-none leading-none hidden xl:block"
        style={{ fontSize: "7.5rem", top: "-1.2rem", left: "-8rem" }}
      >
        {String(num).padStart(2, "0")}
      </span>

      {/* Eyebrow row */}
      <div className="flex items-center gap-5 mb-5">
        <span className="text-[8px] uppercase tracking-[0.6em] font-semibold font-sans text-[#371628]/30">
          {String(num).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px bg-[#371628]/10" />
      </div>

      <h2
        className="font-serif font-normal text-[#371628] leading-[1.15]"
        style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.85rem)" }}
      >
        {text}
      </h2>
    </div>
  );
}

/* ─── Pull quote — full-viewport breakout ────────────────── */
function PullQuote({ text }: { text: string }) {
  return (
    <motion.div
      className="my-20 relative"
      style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-[#371628] py-24 px-8 overflow-hidden relative">
        {/* Decorative giant quote mark */}
        <span
          className="absolute left-1/2 -translate-x-1/2 top-0 font-serif text-white/[0.035] select-none pointer-events-none leading-none"
          style={{ fontSize: "28rem", lineHeight: 0.65 }}
        >
          "
        </span>

        {/* Rules */}
        <div className="absolute top-10 left-0 right-0 h-px bg-white/7" />
        <div className="absolute bottom-10 left-0 right-0 h-px bg-white/7" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Small decorative line above */}
          <div className="w-8 h-px bg-white/20 mx-auto mb-10" />
          <p
            className="font-serif font-normal text-[#FAF8F5] leading-[1.38] italic"
            style={{ fontSize: "clamp(1.55rem, 3vw, 2.35rem)" }}
          >
            {text}
          </p>
          <div className="w-8 h-px bg-white/20 mx-auto mt-10" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Divider ────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-5 my-12">
      <div className="flex-1 h-px bg-[#371628]/8" />
      <span className="text-[#371628]/18 font-serif text-sm select-none">✦</span>
      <div className="flex-1 h-px bg-[#371628]/8" />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero({ image, category, title, date, readTime, index }: {
  image: string; category: string; title: string; date: string; readTime: number; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: "100svh", minHeight: "640px", maxHeight: "960px" }}>
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y, scale: 1.14 }}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>

      {/* Overlays — layered for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#180a11]/95 via-[#371628]/45 to-[#1e0d16]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#180a11]/35 via-transparent to-transparent" />

      {/* Decorative article number */}
      <motion.span
        className="absolute right-8 bottom-8 font-serif text-white/[0.05] select-none pointer-events-none leading-none hidden lg:block"
        style={{ fontSize: "20rem", lineHeight: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-24 md:pb-32"
      >
        {/* Back */}
        <Link href="/journal">
          <motion.div
            className="absolute top-8 left-8 md:left-16 lg:left-24 flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer group"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-[8.5px] uppercase tracking-[0.55em] font-semibold font-sans">The Journal</span>
          </motion.div>
        </Link>

        <div className="max-w-4xl">
          {/* Meta row */}
          <motion.div
            className="flex items-center flex-wrap gap-5 mb-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22 }}
          >
            <span
              className="inline-block text-white text-[8px] uppercase tracking-[0.55em] font-semibold font-sans px-4 py-2"
              style={{ background: "rgba(250,248,245,0.1)", backdropFilter: "blur(14px)", border: "1px solid rgba(250,248,245,0.16)" }}
            >
              {category}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-white/35 text-[8.5px] uppercase tracking-[0.45em] font-sans">{date}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/28" />
              <span className="text-white/30 text-[8.5px] font-sans tracking-wide">{readTime} min read</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-serif font-normal text-[#FAF8F5] leading-[1.03]"
            style={{ fontSize: "clamp(2.4rem, 5.8vw, 4.8rem)", letterSpacing: "-0.01em" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
        </div>
      </motion.div>

      {/* Bottom bleed into body */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
    </div>
  );
}

/* ─── Related card ───────────────────────────────────────── */
function RelatedCard({ article, num }: { article: Article; num: number }) {
  return (
    <Link href={`/journal/${article.slug}`} className="block group">
      <div className="grid sm:grid-cols-12 gap-7 items-center py-9 border-b border-[#371628]/8 last:border-0">
        {/* Number */}
        <div className="sm:col-span-1 hidden sm:flex items-start pt-1">
          <span className="font-serif text-[#371628]/15 text-xl select-none">
            {String(num).padStart(2, "0")}
          </span>
        </div>
        {/* Image */}
        <div className="sm:col-span-3 relative overflow-hidden" style={{ height: "120px" }}>
          <motion.img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-[#371628]/0 group-hover:bg-[#371628]/18 transition-colors duration-500" />
        </div>
        {/* Copy */}
        <div className="sm:col-span-7 space-y-2.5">
          <Eyebrow>{article.category}</Eyebrow>
          <h4
            className="font-serif font-normal text-[#2a1f25] group-hover:text-[#371628] transition-colors duration-400 leading-[1.2]"
            style={{ fontSize: "clamp(1.02rem, 1.45vw, 1.18rem)" }}
          >
            {article.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[#371628]/30">
            <Clock className="w-2.5 h-2.5" />
            <span className="text-[9px] font-sans">{article.readTime} min</span>
          </div>
        </div>
        {/* Arrow */}
        <div className="sm:col-span-1 hidden sm:flex justify-end">
          <ArrowRight className="w-3.5 h-3.5 text-[#371628]/20 group-hover:text-[#371628]/60 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Fade-in helper ─────────────────────────────────────── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-36px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function JournalPost() {
  const { articles } = useCms();
  const params  = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === params.slug);
  const index   = articles.findIndex(a => a.slug === params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-7">
        <p className="font-serif text-3xl text-[#371628]/30">Article not found.</p>
        <Link href="/journal">
          <button className="text-[9px] uppercase tracking-[0.5em] font-semibold font-sans text-[#371628]/45 hover:text-[#371628] transition-colors border-b border-[#371628]/20 hover:border-[#371628]/50 pb-0.5">
            Return to The Journal
          </button>
        </Link>
      </div>
    );
  }

  const related = articles.filter(a => a.slug !== article.slug).slice(0, 3);

  let paraCount    = 0;
  let headingCount = 0;

  return (
    <div className="bg-[#FAF8F5]">
      <ProgressBar />

      <Hero
        image={article.image}
        category={article.category}
        title={article.title}
        date={article.date}
        readTime={article.readTime}
        index={index}
      />

      {/* ── Article body — pull quotes break out via negative margin ── */}
      <div className="relative max-w-[700px] mx-auto px-6 pb-28">

        <FadeIn>
          {/* Subtitle */}
          <p
            className="font-serif font-normal text-[#371628]/52 leading-[1.55] mb-9 italic"
            style={{ fontSize: "clamp(1.12rem, 2.1vw, 1.36rem)" }}
          >
            {article.subtitle}
          </p>

          {/* Category rule */}
          <div className="flex items-center gap-5 mb-14">
            <div className="h-px w-9 bg-[#371628]/22" />
            <Eyebrow>{article.category}</Eyebrow>
          </div>
        </FadeIn>

        {/* Body blocks */}
        {article.body.map((block, i) => {
          if (block.type === "paragraph") {
            paraCount++;
            const isFirst = paraCount === 1;
            return (
              <FadeIn key={i} delay={isFirst ? 0.06 : 0}>
                {isFirst
                  ? <DropCapParagraph text={block.text} />
                  : <Paragraph text={block.text} />
                }
              </FadeIn>
            );
          }
          if (block.type === "heading") {
            headingCount++;
            const n = headingCount;
            return (
              <FadeIn key={i}>
                <SectionHeading text={block.text} num={n} />
              </FadeIn>
            );
          }
          if (block.type === "pullquote") {
            return (
              <FadeIn key={i}>
                <PullQuote text={block.text} />
              </FadeIn>
            );
          }
          if (block.type === "divider") {
            return <Divider key={i} />;
          }
          return null;
        })}

        {/* Closing ornament */}
        <div className="flex items-center gap-5 mt-20 mb-16">
          <div className="flex-1 h-px bg-[#371628]/8" />
          <span className="font-sans text-[7.5px] uppercase tracking-[0.65em] font-semibold text-[#371628]/18 whitespace-nowrap">
            Canvas Real Estate · Geelong
          </span>
          <div className="flex-1 h-px bg-[#371628]/8" />
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="text-center py-4">
            <Eyebrow>Thinking of buying or selling?</Eyebrow>
            <p
              className="font-serif font-normal text-[#371628] leading-snug mt-5 mb-9 mx-auto"
              style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)", maxWidth: "380px" }}
            >
              Let our Geelong team guide you home.
            </p>
            <Link href="/contact">
              <button className="inline-flex items-center gap-3.5 bg-[#371628] text-white font-sans font-semibold text-[13px] tracking-wide px-10 py-4 hover:bg-[#2d1020] transition-colors shadow-2xl shadow-[#371628]/18">
                Speak with our team
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <div className="border-t border-[#371628]/8" style={{ background: "#FDFBF8" }}>
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-32">
            <FadeIn>
              <div className="flex items-end justify-between mb-1">
                <div>
                  <Eyebrow>Continue Reading</Eyebrow>
                  <h2
                    className="font-serif font-normal text-[#371628] mt-3"
                    style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
                  >
                    More from the Journal
                  </h2>
                </div>
                <Link href="/journal">
                  <button className="hidden md:flex items-center gap-2.5 text-[8.5px] uppercase tracking-[0.45em] font-semibold font-sans text-[#371628]/35 hover:text-[#371628] transition-colors duration-300">
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </FadeIn>

            <div className="mt-6">
              {related.map((a, i) => (
                <FadeIn key={a.slug} delay={i * 0.07}>
                  <RelatedCard article={a} num={i + 1} />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
