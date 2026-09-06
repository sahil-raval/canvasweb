import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useParams } from "wouter";
import {
  Bed, Bath, Car, ArrowLeft, Phone, Mail, ArrowRight,
  Maximize2, Home, MapPin, Check, ChevronLeft, ChevronRight, X,
  Calendar, Shield, PawPrint, Sofa,
} from "lucide-react";
import { useCms } from "@/lib/cms";
import poojaImg  from "@/assets/canvas/agent-pooja-new.jpg";
import chandraImg from "@/assets/canvas/agent-chandra-new.jpg";

/* ─── Helpers ────────────────────────────────────────────── */
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[10px] uppercase tracking-[0.35em] font-semibold font-sans ${light ? "text-white/30" : "text-[#371628]/45"}`}>
      {children}
    </p>
  );
}
function Divider() {
  return <div className="h-px bg-[#371628]/8 my-14" />;
}
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
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
        <X className="w-7 h-7" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 bg-white/8 hover:bg-white/15">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <motion.img
        key={current}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={images[current]} alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 bg-white/8 hover:bg-white/15">
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
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [form, setForm]       = useState({
    name: "", email: "", phone: "",
    message: `I'm interested in renting ${address} and would like to arrange an inspection.`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, property: address, enquiryType: "Rent a Property" }),
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
        { field: "name",  label: "Full Name",      type: "text",  required: true },
        { field: "email", label: "Email Address",  type: "email", required: true },
        { field: "phone", label: "Phone Number",   type: "tel",   required: false },
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
        {loading ? "Sending…" : <> Book an Inspection <ArrowRight className="w-3.5 h-3.5" /> </>}
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
export default function RentalDetail() {
  const { rentals, agents } = useCms();
  const { slug }  = useParams<{ slug: string }>();
  const rental    = rentals.find((item) => item.slug === (slug || ""));
  const heroRef   = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx,  setLightboxIdx]  = useState(0);

  if (!rental) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-7">
        <p className="font-serif text-3xl text-[#371628]/30">Property Not Found</p>
        <Link href="/rent">
          <button className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] font-semibold font-sans text-[#371628]/40 hover:text-[#371628] transition-colors border-b border-[#371628]/20 hover:border-[#371628]/50 pb-0.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Rentals
          </button>
        </Link>
      </div>
    );
  }

  const cmsAgent = agents.find((agent) => agent.key === rental.agent);
  const agentName  = cmsAgent?.name ?? (rental.agent === "pooja" ? "Pooja Patel" : "Chandra Bhatt");
  const agentImg   = cmsAgent?.photo ?? (rental.agent === "pooja" ? poojaImg : chandraImg);
  const agentTitle = cmsAgent?.role ?? (rental.agent === "pooja" ? "Director & Founder" : "Director & Co-Founder");
  const allImages  = [rental.heroImage, ...rental.gallery];
  const availableNow = rental.available.toLowerCase() === "now";

  const openLightbox  = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = () => setLightboxIdx(i => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setLightboxIdx(i => (i + 1) % allImages.length);

  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: heroY }}>
          <img src={rental.heroImage} alt={rental.address} className="w-full h-full object-cover" />
        </motion.div>

        <div className="absolute top-0 left-0 right-0 z-20 pt-6 px-6 md:px-10 mt-16">
          <Link href="/rent">
            <span className="inline-flex items-center gap-2.5 text-white/55 text-[9px] font-semibold font-sans uppercase tracking-[0.45em] hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              Rental Properties
            </span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(55,22,40,0.92) 0%, rgba(55,22,40,0.5) 55%, transparent 100%)" }} />
          <div className="relative z-10 px-6 md:px-10 pb-10 pt-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-white leading-none"
                style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                {rental.address}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="flex flex-col md:items-end gap-1.5 shrink-0"
              >
                <p className="text-white/70 text-sm font-sans tracking-[0.08em]">
                  {rental.suburb}, {rental.state}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold font-sans uppercase tracking-[0.35em] text-white/45 border border-white/18 px-3 py-1 w-fit">
                    For Rent
                  </span>
                  {availableNow && (
                    <span className="text-[9px] font-semibold font-sans uppercase tracking-[0.35em] text-white px-3 py-1 w-fit" style={{ background: "rgba(22,101,52,0.7)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      Available Now
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY SPECS STRIP ── */}
      <section className="bg-white border-b border-[#371628]/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-stretch divide-x divide-[#371628]/8">
            {/* Rent per week */}
            <div className="py-8 pr-8 md:pr-12 shrink-0">
              <Eyebrow>Weekly Rent</Eyebrow>
              <p className="font-serif text-[#371628] mt-1" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontVariantNumeric: "tabular-nums" }}>
                {rental.rentPw}
              </p>
            </div>
            {/* Stats */}
            {[
              { icon: Bed,       value: rental.beds,  label: rental.beds === 1 ? "Bedroom" : "Bedrooms" },
              { icon: Bath,      value: rental.baths, label: rental.baths === 1 ? "Bathroom" : "Bathrooms" },
              { icon: Car,       value: rental.cars,  label: rental.cars === 1 ? "Car Space" : "Car Spaces" },
              { icon: Maximize2, value: rental.land,  label: "Land Size" },
              { icon: Home,      value: rental.type,  label: "Property Type" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="py-8 px-6 md:px-10 flex flex-col gap-1">
                <Icon className="w-4 h-4 text-[#371628]/35 mb-1" strokeWidth={1.5} />
                <p className="font-serif text-[#2a1f25] text-lg leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</p>
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
              <FadeUp><Eyebrow>About This Property</Eyebrow></FadeUp>
              <div className="space-y-6 mt-7 mb-14">
                {rental.description.map((para, i) => (
                  <FadeUp key={i} delay={i * 0.07}>
                    <p className="text-[#2a1f25]/60 leading-[1.9] font-sans" style={{ fontSize: "0.975rem" }}>{para}</p>
                  </FadeUp>
                ))}
              </div>

              <Divider />

              {/* Tenancy details */}
              <FadeUp><Eyebrow>Tenancy Details</Eyebrow></FadeUp>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mt-7 mb-14 border border-[#371628]/8">
                {[
                  { icon: Calendar, label: "Available",   value: rental.available },
                  { icon: Shield,   label: "Bond",        value: rental.bond },
                  { icon: Home,     label: "Lease Term",  value: rental.leaseLength },
                  { icon: PawPrint, label: "Pets",        value: rental.petsConsidered ? "Considered" : "Not Allowed" },
                ].map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`px-6 py-6 flex flex-col gap-3 ${i < 3 ? "border-r border-[#371628]/8" : ""} ${i >= 2 ? "border-t sm:border-t-0 border-[#371628]/8" : ""}`}
                  >
                    <Icon className="w-4 h-4 text-[#371628]/35" strokeWidth={1.5} />
                    <div>
                      <Eyebrow>{label}</Eyebrow>
                      <p className="font-sans font-medium text-[#2a1f25]/80 mt-1" style={{ fontSize: "0.9rem" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Features */}
              <FadeUp><Eyebrow>Property Features</Eyebrow></FadeUp>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mt-7 mb-14">
                {rental.features.map((feat, i) => (
                  <FadeUp key={i} delay={i * 0.04}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-5 h-5 border border-[#371628]/18 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#371628]" strokeWidth={2.5} />
                      </div>
                      <span className="text-[#2a1f25]/65 font-sans leading-relaxed" style={{ fontSize: "0.9rem" }}>{feat}</span>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <Divider />

              {/* Photo Gallery */}
              <FadeUp><Eyebrow>Photo Gallery</Eyebrow></FadeUp>
              <div className="grid grid-cols-12 gap-3 mt-7">
                <FadeUp className="col-span-12 md:col-span-8">
                  <button onClick={() => openLightbox(0)} className="w-full overflow-hidden group relative block" style={{ aspectRatio: "16/10" }}>
                    <img src={rental.heroImage} alt="Main photo" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
                  </button>
                </FadeUp>
                <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                  {rental.gallery.slice(0, 2).map((img, i) => (
                    <FadeUp key={i} delay={0.06 * (i + 1)}>
                      <button onClick={() => openLightbox(i + 1)} className="w-full overflow-hidden group relative block" style={{ aspectRatio: "4/3" }}>
                        <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
                      </button>
                    </FadeUp>
                  ))}
                </div>
                {rental.gallery.slice(2, 4).map((img, i) => (
                  <FadeUp key={i} className="col-span-6" delay={0.1 + i * 0.06}>
                    <button onClick={() => openLightbox(i + 3)} className="w-full overflow-hidden group relative block" style={{ aspectRatio: "16/10" }}>
                      <img src={img} alt={`Photo ${i + 4}`} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
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

                {/* Rent summary card */}
                <FadeUp>
                  <div className="border border-[#371628]/10 p-7 bg-white">
                    <Eyebrow>Rental Summary</Eyebrow>
                    <p className="font-serif text-[#371628] mt-2 mb-5" style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontVariantNumeric: "tabular-nums" }}>
                      {rental.rentPw}
                    </p>
                    <div className="space-y-3 border-t border-[#371628]/8 pt-5">
                      {[
                        { label: "Bond",        value: rental.bond },
                        { label: "Available",   value: rental.available },
                        { label: "Lease",       value: rental.leaseLength },
                        { label: "Furnished",   value: rental.furnished ? "Yes" : "Unfurnished" },
                        { label: "Pets",        value: rental.petsConsidered ? "Considered" : "Not Allowed" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#371628]/6 last:border-0">
                          <span className="text-[9.5px] uppercase tracking-[0.4em] font-semibold font-sans text-[#371628]/38">{label}</span>
                          <span className="font-sans text-[#2a1f25]/75 text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeUp>

                {/* Agent card */}
                <FadeUp delay={0.06}>
                  <div className="border border-[#371628]/10 p-7 bg-white">
                    <Eyebrow>Your Property Manager</Eyebrow>
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
                      <a href="tel:0469131347" className="flex items-center gap-3 font-sans text-sm text-[#2a1f25]/65 hover:text-[#371628] transition-colors group">
                        <div className="w-8 h-8 bg-[#371628]/5 flex items-center justify-center group-hover:bg-[#371628]/10 transition-colors">
                          <Phone className="w-3.5 h-3.5 text-[#371628]" strokeWidth={1.5} />
                        </div>
                        0469 131 347
                      </a>
                      <a href="mailto:enquiry@canvasrealestate.com.au" className="flex items-center gap-3 font-sans text-sm text-[#2a1f25]/65 hover:text-[#371628] transition-colors group">
                        <div className="w-8 h-8 bg-[#371628]/5 flex items-center justify-center group-hover:bg-[#371628]/10 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-[#371628]" strokeWidth={1.5} />
                        </div>
                        enquiry@canvasrealestate.com.au
                      </a>
                    </div>
                  </div>
                </FadeUp>

                {/* Enquiry form */}
                <FadeUp delay={0.1}>
                  <div className="border border-[#371628]/10 p-7 bg-white">
                    <Eyebrow>Book an Inspection</Eyebrow>
                    <p className="font-serif text-[#2a1f25] mt-3 mb-6 leading-snug" style={{ fontSize: "1.1rem" }}>
                      {rental.address}, {rental.suburb}
                    </p>
                    <EnquiryForm address={`${rental.address}, ${rental.suburb}`} agentName={agentName.split(" ")[0]} />
                  </div>
                </FadeUp>

                {/* Location */}
                <FadeUp delay={0.14}>
                  <div className="border border-[#371628]/10 p-5 flex items-center gap-4 bg-white">
                    <div className="w-9 h-9 bg-[#371628]/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#371628]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-sans font-medium text-[#2a1f25]/80 text-sm">{rental.suburb}, {rental.state}</p>
                      <p className="text-[10px] text-[#371628]/35 font-sans">Geelong Region, Victoria</p>
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE RENTALS ── */}
      <section className="py-20 border-t border-[#371628]/8 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <FadeUp className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Continue Browsing</Eyebrow>
              <h2 className="font-serif text-[#2a1f25] mt-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400 }}>
                More Rentals
              </h2>
            </div>
            <Link href="/rent">
              <button className="hidden md:flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.35em] font-sans text-[#371628]/38 hover:text-[#371628] transition-colors">
                All Rentals <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </FadeUp>
          <Link href="/rent">
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] font-sans text-[#371628] hover:opacity-60 transition-opacity md:hidden mb-8">
              View All Rentals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox images={allImages} current={lightboxIdx} onClose={closeLightbox} onPrev={prevImg} onNext={nextImg} />
      )}
    </div>
  );
}
