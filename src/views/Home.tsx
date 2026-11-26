"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Star, Shield, Users, TrendingUp, Award,
  Phone, Mail, Quote, CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
const heroImg = "/images/geelong-hero.jpg";
const poojaImg = "/images/agent-pooja-new.jpg";
const chandraImg = "/images/agent-chandra-new.jpg";
import { ListingCard } from "@/components/ListingCard";
import { ContactForm } from "@/components/ContactForm";
import { useCms } from "@/lib/cms/context";
import { isSold } from "@/lib/cms/listing";
import { googleRating, homeReviews } from "@/lib/cms/reviews";
import type { CmsReview } from "@/lib/cms/types";
import { GoogleRatingLine, ReviewActions, Stars } from "@/components/Reviews";


const pillars = [
  { icon: Shield,    title: "Transparent & Honest",   desc: "No hidden agendas. You'll always know exactly where you stand with clear, straightforward advice at every stage." },
  { icon: Users,     title: "Genuinely Personal",     desc: "We take the time to understand your unique goals, not just your property. Every client receives our full attention." },
  { icon: TrendingUp,title: "Results-Driven",         desc: "Our track record speaks for itself. We work tirelessly to maximise your outcome and exceed your expectations." },
  { icon: Award,     title: "Local Expertise",        desc: "Born and raised in Geelong. We know every street, suburb, and market nuance that gives you the competitive edge." },
];

const processSteps = [
  { num: "01", title: "Consultation",  desc: "We meet, listen, and understand your goals. No pressure, no obligation. Just honest conversation." },
  { num: "02", title: "Market Appraisal",   desc: "Receive a data-driven valuation based on current Geelong market conditions and comparable sales." },
  { num: "03", title: "Tailored Strategy",  desc: "We craft a personalised marketing plan designed to attract the right buyers and achieve premium results." },
  { num: "04", title: "Exceptional Outcome",desc: "Watch as your property is expertly positioned, negotiated, and sold for the best possible price." },
];

/* ─── Testimonial Slider ────────────────────────────── */
const SLIDE_DIR = { enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }) };

function TestimonialSlider({ testimonials }: { testimonials: CmsReview[] }) {
  const [idx, setIdx]         = useState(0);
  const [dir, setDir]         = useState(1);
  const [paused, setPaused]   = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => { setDir(1); setIdx(i => (i + 1) % testimonials.length); }, 4500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (next: number) => {
    setDir(next > idx || (idx === testimonials.length - 1 && next === 0) ? 1 : -1);
    setIdx(next);
  };
  const prev = () => { const n = (idx - 1 + testimonials.length) % testimonials.length; setDir(-1); setIdx(n); };
  const next = () => { const n = (idx + 1) % testimonials.length; setDir(1); setIdx(n); };

  const t = testimonials[idx];

  return (
    <div
      className="relative max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FAF8F5] border border-gray-100 px-10 md:px-16 pt-12 pb-10 min-h-[280px] flex flex-col justify-between">
        {/* Decorative quote */}
        <Quote className="absolute top-8 right-8 w-10 h-10 text-[#371628]/8" />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={SLIDE_DIR}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: Math.round(t.rating) }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#371628] fill-[#371628]" />
              ))}
            </div>
            {/* Quote */}
            <p className="text-gray-700 text-lg md:text-xl font-serif leading-relaxed mb-8">
              "{t.text}"
            </p>
            {/* Attribution */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#371628] flex items-center justify-center text-white text-sm font-bold font-sans shrink-0">
                {t.authorName[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 font-sans">{t.authorName}</p>
                <p className="text-xs text-gray-400 font-sans">{[t.suburb, t.source && `via ${t.source}`].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-[#371628]/30 hover:shadow-md transition-all duration-200"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-[#371628]/30 hover:shadow-md transition-all duration-200"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2.5 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`transition-all duration-300 rounded-full ${
              i === idx ? "w-6 h-2 bg-[#371628]" : "w-2 h-2 bg-[#371628]/20 hover:bg-[#371628]/40"
            }`}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function Home() {
  const cms = useCms();
  const { listings: allListings, pages, siteSettings, agents } = cms;
  const reviews = homeReviews(cms);
  const rating = googleRating(siteSettings);
  const page = pages.find((item) => item.slug === "home");
  const hc = page?.homeContent ?? {};
  // Sanity text if entered, otherwise the default copy.
  const steps = hc.processSteps?.length
    ? hc.processSteps.map((x, i) => ({ num: x.number || String(i + 1).padStart(2, "0"), title: x.title || "", desc: x.description || "" }))
    : processSteps;
  const cards = hc.pillars?.length
    ? hc.pillars.map((x, i) => ({ icon: pillars[i % pillars.length].icon, title: x.title || "", desc: x.description || "" }))
    : pillars;
  const teamPoints = hc.teamPoints?.length
    ? hc.teamPoints
    : ["Independent & locally owned", "Combined 15+ years of industry expertise", "Deeply embedded in the Geelong community", "Available when you need us, not just 9 to 5"];
  const team = agents.length
    ? agents.slice(0, 2).map((a) => ({ img: a.photo || (a.key === "chandra" ? chandraImg : poojaImg), name: a.name, role: a.role || "" }))
    : [{ img: poojaImg, name: "Pooja Patel", role: "Director / Licensed Estate Agent" }, { img: chandraImg, name: "Chandra Bhatt", role: "Director" }];
  const quote = reviews[0];
  // Only current (not sold) listings are featured and counted.
  const listings = allListings.filter((l) => !isSold(l.status));
  const featuredListings = listings.slice(0, 3);
  const phone = siteSettings.phone || "0469 131 347";
  const email = siteSettings.email || "enquiry@canvasrealestate.com.au";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <img fetchPriority="high" src={page?.heroImage || heroImg} alt="Geelong luxury home" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        {/* Floating trust badge (only when a Google rating is set in Sanity) */}
        {rating && (
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute top-32 left-6 md:left-12 hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3"
        >
          <Stars value={rating.rating} className="w-3.5 h-3.5 text-white fill-white" />
          <span className="text-white text-xs font-semibold font-sans">{rating.rating.toFixed(1)} Google Rating</span>
        </motion.div>
        )}

        {/* Floating active listing badge */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute top-32 right-6 md:right-12 hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold font-sans">{listings.length} Active Listings</span>
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 text-center text-white mt-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 font-semibold font-sans mb-6"
          >
            {page?.eyebrow || "Geelong's Trusted Independent Agency"}
          </motion.p>
          <motion.h1
            initial={{ y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal leading-[1.05] max-w-5xl mx-auto mb-8"
          >
            {page?.heading || "Your Story Starts Here in Geelong."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-sans font-light leading-relaxed"
          >
            {page?.intro || "Canvas Real Estate combines deep local expertise with a genuinely personal approach, so you achieve the outcome you deserve."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={hc.heroPrimaryHref || "/listings"}>
              <button className="h-14 px-10 text-sm font-bold font-sans bg-[#371628] text-white rounded-2xl hover:bg-[#2d1020] active:scale-95 transition-all duration-200 shadow-xl shadow-[#371628]/40">
                {hc.heroPrimaryLabel || "Explore Listings"}
              </button>
            </Link>
            <Link href={hc.heroSecondaryHref || "/contact"}>
              <button className="h-14 px-10 text-sm font-semibold font-sans bg-white/10 text-white border border-white/30 rounded-2xl hover:bg-white/20 backdrop-blur-sm active:scale-95 transition-all duration-200">
                {hc.heroSecondaryLabel || "Property Appraisal →"}
              </button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
              className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ──────────────────────────────────────── */}
      <section className="py-28 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#371628]/50 font-semibold font-sans mb-3">{hc.featuredEyebrow || "Curated For You"}</p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-normal leading-tight">{hc.featuredHeading || "Featured Properties"}</h2>
              <p className="text-gray-500 font-sans mt-3 max-w-md text-sm leading-relaxed">{hc.featuredBody || "Each listing is hand-selected and expertly presented. Properties at this level move quickly."}</p>
            </div>
            <Link href="/listings" className="group flex items-center gap-2 text-[#371628] font-semibold font-sans text-sm hover:gap-4 transition-all duration-300 shrink-0">
              {hc.featuredLinkLabel || "View All Properties"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-3 bg-[#371628]/5 border border-[#371628]/10 rounded-2xl px-5 py-3 mb-10 w-fit">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-[#371628]/70 font-semibold font-sans">{hc.featuredUrgency || "These properties are actively attracting buyer enquiries"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing, i) => <ListingCard key={listing.slug} listing={listing} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-[#371628]/50 font-semibold font-sans mb-4">{hc.processEyebrow || "How It Works"}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-normal leading-tight">{hc.processHeading || "Your Journey, Simplified"}</h2>
            <p className="text-gray-500 font-sans mt-4 text-sm leading-relaxed">{hc.processBody || "We've refined every step of the process so you feel informed, confident, and in control from day one."}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#371628]/20 to-transparent hidden lg:block" />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative text-center px-6"
              >
                <div className="w-20 h-20 rounded-full bg-[#371628] text-white flex items-center justify-center mx-auto mb-6 text-xl font-serif font-normal shadow-xl shadow-[#371628]/20 relative z-10">
                  {step.num}
                </div>
                <h3 className="text-lg font-serif font-normal text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 font-sans text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href={hc.processCtaHref || "/contact"}>
              <button className="h-14 px-12 text-sm font-bold font-sans bg-[#371628] text-white rounded-2xl hover:bg-[#2d1020] active:scale-95 transition-all duration-200 shadow-lg shadow-[#371628]/20">
                {hc.processCtaLabel || "Start Your Journey Today"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CANVAS ─────────────────────────────────────────────── */}
      <section className="py-28 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-[#371628]/50 font-semibold font-sans mb-4">{hc.pillarsEyebrow || "The Canvas Difference"}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-normal">{hc.pillarsHeading || "Why Choose Canvas?"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#371628]/10 hover:-translate-y-2 transition-all duration-300 border border-gray-100/80"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#371628]/8 flex items-center justify-center text-[#371628] mb-6 group-hover:bg-[#371628] group-hover:text-white transition-all duration-300">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-normal text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-500 font-sans text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24 lg:py-28 bg-[#371628] text-white relative overflow-hidden">
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white -translate-x-1/2 translate-y-1/2" />
  </div>
  <div className="container mx-auto px-6 md:px-12 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold font-sans mb-4">{hc.teamEyebrow || "Meet the Team"}</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal leading-tight mb-6">
          {hc.teamHeading || <>Real People.<br />Real Results.</>}
        </h2>
        <p className="text-white/70 text-base md:text-lg font-sans font-light leading-relaxed mb-8 max-w-lg">
          {hc.teamBody || "Pooja Patel and Chandra Bhatt founded Canvas Real Estate on a simple belief: that every client deserves honest advice, genuine care, and a result they're proud of."}
        </p>
        <div className="space-y-3 mb-10">
          {teamPoints.map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0" />
              <span className="text-white/80 font-sans text-sm">{point}</span>
            </div>
          ))}
        </div>
        <Link href={hc.teamCtaHref || "/about"}>
          <button className="h-12 px-8 text-sm font-bold font-sans bg-white text-[#371628] rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg">
            {hc.teamCtaLabel || "Our Full Story →"}
          </button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="flex flex-row gap-3 sm:gap-4"
      >
        {team.map((person) => (
          <div
            key={person.name}
            className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden relative h-[280px] sm:h-[360px] lg:h-[420px]"
          >
            <img loading="lazy" decoding="async"
              src={person.img}
              alt={person.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-white font-serif font-normal text-sm sm:text-base leading-tight">{person.name}</p>
                <p className="text-white/60 font-sans text-[10px] sm:text-xs">{person.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
</section>

      {/* ── TESTIMONIALS (auto-slider) ──────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#371628]/50 font-semibold font-sans mb-4">{hc.reviewsEyebrow || "Client Stories"}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-normal">{hc.reviewsHeading || "What Our Clients Say"}</h2>
            <GoogleRatingLine summary={rating} />
          </div>
          <TestimonialSlider testimonials={reviews} />
          <ReviewActions summary={rating} />
        </div>
      </section>

      {/* ── CTA / CONTACT ──────────────────────────────────────────── */}
      <section className="py-28 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-[#371628]/12">
            <div
              className="lg:col-span-2 p-10 md:p-14 flex flex-col justify-between"
              style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold font-sans mb-4">{hc.contactEyebrow || "Let's Talk"}</p>
                <h2 className="text-3xl md:text-4xl font-serif font-normal text-white leading-tight mb-6">
                  {hc.contactHeading || "Ready to make your move?"}
                </h2>
                <p className="text-white/60 font-sans text-sm leading-relaxed mb-10">
                  {hc.contactBody || "Whether you're selling, buying, or simply curious about your property's value, we're here to give you the honest guidance you need."}
                </p>
                <div className="space-y-5">
                  <a href={phoneHref} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40">Call Us</p>
                      <p className="text-white font-semibold font-sans text-sm">{phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40">Email Us</p>
                      <p className="text-white font-semibold font-sans text-sm break-all">{email}</p>
                    </div>
                  </a>
                </div>
              </div>
              {quote && (
                <figure className="mt-12">
                  <Stars value={quote.rating} className="w-4 h-4 text-white fill-white" />
                  <blockquote className="mt-2 text-white/50 font-sans text-xs leading-relaxed line-clamp-3">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-1 text-white/40 font-sans text-[11px]">{quote.authorName}{quote.suburb ? `, ${quote.suburb}` : ""}</figcaption>
                </figure>
              )}
            </div>
            <div className="lg:col-span-3 bg-white p-10 md:p-14">
              <h3 className="text-2xl font-serif font-normal text-gray-900 mb-8">{hc.formHeading || "Send Your Enquiry"}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
