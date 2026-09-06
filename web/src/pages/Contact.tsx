import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Clock, Shield, Star } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import poojaImg from "@/assets/canvas/agent-pooja-new.jpg";
import chandraImg from "@/assets/canvas/agent-chandra-new.jpg";
import { useCms } from "@/lib/cms";

const trustPoints = [
  { icon: Clock, text: "Response within 24 hours" },
  { icon: Shield, text: "100% confidential & obligation-free" },
  { icon: Star, text: "5.0 Google Rating" },
];

export default function Contact() {
  const { pages, siteSettings, agents } = useCms();
  const page = pages.find((item) => item.slug === "contact");
  const phone = siteSettings.phone || "0469 131 347";
  const email = siteSettings.email || "enquiry@canvasrealestate.com.au";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const socialIcons = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, youtube: Youtube };
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}>
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white translate-x-1/3 -translate-y-1/2" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold font-sans mb-5">{page?.eyebrow || "We're Here For You"}</p>
            <h1 className="text-5xl md:text-6xl font-serif font-normal text-white leading-tight mb-6">
              {page?.heading || "Let's Start the Conversation"}
            </h1>
            <p className="text-white/65 text-lg font-sans leading-relaxed">
              {page?.intro || "Whether you're ready to sell, searching for your perfect home, or simply want to understand what your property is worth. We'd love to hear from you."}
            </p>
            {/* Trust points */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {trustPoints.map((t, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
                  <t.icon className="w-4 h-4 text-white/70" />
                  <span className="text-white/80 text-xs font-medium">{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN FORM SECTION ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-[#371628]/12 bg-white">

            {/* Left — info panel */}
            <div
              className="lg:col-span-2 p-10 md:p-14 flex flex-col"
              style={{ background: "linear-gradient(145deg, #371628 0%, #1a0d14 100%)" }}
            >
              <div>
                <h2 className="text-2xl font-serif text-white mb-8">Get in Touch</h2>

                {/* Contact Details */}
                <div className="space-y-6 mb-10">
                  <a href={phoneHref} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-1">Phone</p>
                      <p className="text-white font-semibold">{phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${email}`} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-1">Email</p>
                      <p className="text-white font-semibold text-sm break-all">{email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-1">Location</p>
                      <p className="text-white font-semibold">{siteSettings.location || "Geelong, Victoria"}</p>
                      <p className="text-white/60 text-sm">{siteSettings.serviceArea || "Serving all Geelong suburbs"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-1">Hours</p>
                      <p className="text-white font-semibold">{siteSettings.weekdayHours || "Mon–Fri: 9am – 6pm"}</p>
                      <p className="text-white/60 text-sm">{siteSettings.weekendHours || "Sat: 10am – 3pm · Sun: By appt."}</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {(siteSettings.socialLinks || []).map((social) => {
                      const Icon = socialIcons[social.platform.toLowerCase() as keyof typeof socialIcons] || Instagram;
                      return (
                      <a key={social.platform} href={social.url} target="_blank" rel="noreferrer" aria-label={social.platform} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group">
                        <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                      </a>
                    )})}
                  </div>
                </div>
              </div>

              {/* Agent cards */}
              <div className="mt-12 pt-10 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-white/40 mb-5">Your Agents</p>
                <div className="flex gap-3">
                  {(agents.length > 0 ? agents.slice(0, 2) : [
                    { key: "pooja", name: "Pooja Patel", role: "Director", photo: poojaImg },
                    { key: "chandra", name: "Chandra Bhatt", role: "Director", photo: chandraImg },
                  ]).map((agent) => (
                    <div key={agent.key} className="flex-1 bg-white/8 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
                      <img src={agent.photo || (agent.key === "pooja" ? poojaImg : chandraImg)} alt={agent.name} className="w-10 h-10 rounded-full object-cover object-center" />
                      <div>
                        <p className="text-white text-xs font-semibold">{agent.name}</p>
                        <p className="text-white/50 text-[10px]">{agent.role || "Agent"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3 p-10 md:p-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#371628]/60 font-semibold font-sans mb-2">Enquiry Form</p>
              <h2 className="text-2xl font-serif font-normal text-gray-900 mb-8">Tell Us What You Need</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY REACH OUT ─────────────────────────────────────────── */}
      <section className="pb-24 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Sell For More", desc: "Our strategic marketing and negotiation expertise consistently achieves prices above comparable sales. Start with a free appraisal.", cta: "Get Appraisal" },
              { title: "Find Your Home", desc: "Tell us exactly what you're looking for and we'll proactively source properties, including off-market opportunities.", cta: "Start Search" },
              { title: "Know Your Value", desc: "Receive a comprehensive, data-backed market appraisal for your property with absolutely no obligation to sell.", cta: "Free Valuation" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#371628]/8 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-1 bg-[#371628] rounded-full mb-6" />
                <h3 className="text-xl font-serif text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{card.desc}</p>
                <a href="#" className="text-[#371628] text-sm font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
                  {card.cta} →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
