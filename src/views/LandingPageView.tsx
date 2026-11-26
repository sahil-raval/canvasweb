import Link from 'next/link'
import {AnswerBox} from '@/components/AnswerBox'
import {ContactForm} from '@/components/ContactForm'
import {FaqSection} from '@/components/FaqSection'
import {ListingCard} from '@/components/ListingCard'
import {RichSections} from '@/components/RichSections'
import {Stars} from '@/components/Reviews'
import {isSold} from '@/lib/cms/listing'
import type {CmsContent, CmsLandingPage, LpCta, LpSection} from '@/lib/cms/types'

/* Landing pages are built in Sanity from sections. Each section type has one design here. */

const BRAND_BG = 'linear-gradient(145deg, #371628 0%, #1a0d14 100%)'

function CtaLink({cta, variant = 'dark'}: {cta?: LpCta | null; variant?: 'dark' | 'light' | 'ghost'}) {
  if (!cta?.label || !cta.href) return null
  const cls = {
    dark: 'bg-[#371628] text-white hover:bg-[#4a1e35]',
    light: 'bg-white text-[#371628] hover:bg-white/90',
    ghost: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
  }[variant]
  const className = `inline-flex h-12 items-center rounded-2xl px-8 font-sans text-sm font-bold transition-colors ${cls}`
  return cta.href.startsWith('/') || cta.href.startsWith('#') ? (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  ) : (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
      {cta.label}
    </a>
  )
}

function Heading({s, light = false, center = false, as: Tag = 'h2'}: {s: LpSection; light?: boolean; center?: boolean; as?: 'h1' | 'h2'}) {
  if (!s.eyebrow && !s.heading) return null
  return (
    <div className={`mb-10 ${center ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {s.eyebrow && (
        <p className={`mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] ${light ? 'text-white/55' : 'text-[#371628]/50'}`}>{s.eyebrow}</p>
      )}
      {s.heading && (
        <Tag className={`font-serif text-3xl font-normal leading-tight md:text-5xl ${light ? 'text-white' : 'text-[#2a1f25]'}`}>{s.heading}</Tag>
      )}
    </div>
  )
}

const text = (body: LpSection['body']) => (typeof body === 'string' ? body : '')

function Hero({s, isFirst}: {s: LpSection; isFirst: boolean}) {
  const Tag = isFirst ? 'h1' : 'h2'
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden pb-20 pt-40">
      {s.image ? (
        <img src={s.image} alt={s.imageAlt || s.heading || ''} fetchPriority={isFirst ? 'high' : undefined} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{background: BRAND_BG}} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        {s.eyebrow && <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{s.eyebrow}</p>}
        {s.heading && <Tag className="mb-6 max-w-4xl font-serif text-5xl font-normal leading-[1.05] text-white md:text-7xl">{s.heading}</Tag>}
        {s.subheading && <p className="mb-10 max-w-2xl font-sans text-lg font-light leading-relaxed text-white/80 md:text-xl">{s.subheading}</p>}
        <div className="flex flex-wrap gap-4">
          <CtaLink cta={s.primaryCta} variant="dark" />
          <CtaLink cta={s.secondaryCta} variant="ghost" />
        </div>
      </div>
    </section>
  )
}

function TextSection({s}: {s: LpSection}) {
  return (
    <section className="bg-[#FAF8F5] py-20">
      <div className="container mx-auto max-w-3xl px-6 md:px-12">
        <Heading s={s} />
        {Array.isArray(s.body) ? <RichSections sections={s.body} /> : <p className="whitespace-pre-line font-sans leading-relaxed text-[#2a1f25]/75">{text(s.body)}</p>}
      </div>
    </section>
  )
}

function ImageText({s}: {s: LpSection}) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-2">
        {s.image && (
          <img
            src={s.image}
            alt={s.imageAlt || s.heading || ''}
            loading="lazy"
            decoding="async"
            className={`aspect-[4/3] w-full rounded-3xl object-cover ${s.imageOnRight ? 'lg:order-2' : ''}`}
          />
        )}
        <div>
          <Heading s={s} />
          {text(s.body) && <p className="mb-8 whitespace-pre-line font-sans leading-relaxed text-[#2a1f25]/75">{text(s.body)}</p>}
          <CtaLink cta={s.cta} />
        </div>
      </div>
    </section>
  )
}

function Cards({s}: {s: LpSection}) {
  const items = (s.items ?? []).filter((x) => x.title)
  return (
    <section className="bg-[#FAF8F5] py-20">
      <div className="container mx-auto px-6 md:px-12">
        <Heading s={s} center />
        {s.intro && <p className="mx-auto -mt-4 mb-12 max-w-2xl text-center font-sans text-[#2a1f25]/65">{s.intro}</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => {
            const card = (
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-xl hover:shadow-[#371628]/8">
                <div className="mb-6 h-1 w-10 rounded-full bg-[#371628]" />
                <h3 className="mb-3 font-serif text-xl text-[#2a1f25]">{x.title}</h3>
                {x.description && <p className="font-sans text-sm leading-relaxed text-[#2a1f25]/60">{x.description}</p>}
              </div>
            )
            return x.href ? (
              <Link key={x.title} href={x.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={x.title}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Steps({s}: {s: LpSection}) {
  const items = (s.items ?? []).filter((x) => x.title)
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-12">
        <Heading s={s} center />
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((x, i) => (
            <li key={x.title} className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#371628] font-serif text-xl text-white">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-2 font-serif text-lg text-[#2a1f25]">{x.title}</h3>
              {x.description && <p className="font-sans text-sm leading-relaxed text-[#2a1f25]/60">{x.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Stats({s}: {s: LpSection}) {
  const items = (s.items ?? []).filter((x) => x.value)
  return (
    <section className="py-20 text-white" style={{background: BRAND_BG}}>
      <div className="container mx-auto px-6 md:px-12">
        <Heading s={s} light center />
        <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {items.map((x) => (
            <div key={`${x.value}${x.label}`}>
              <dd className="font-serif text-4xl md:text-5xl">{x.value}</dd>
              <dt className="mt-2 font-sans text-sm text-white/70">{x.label}</dt>
              {x.source && <p className="mt-1 font-sans text-[11px] text-white/40">Source: {x.source}</p>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Listings({s, content}: {s: LpSection; content: CmsContent}) {
  const wanted = (s.suburbs ?? []).map((x) => x.toLowerCase().trim()).filter(Boolean)
  const items = content.listings
    .filter((l) => (s.show === 'sold' ? isSold(l.status) : s.show === 'all' ? true : !isSold(l.status)))
    .filter((l) => !wanted.length || wanted.includes(l.suburb.toLowerCase().trim()))
    .slice(0, s.limit || 6)
  return (
    <section className="bg-[#FAF8F5] py-20">
      <div className="container mx-auto px-6 md:px-12">
        <Heading s={s} />
        {items.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((l, i) => (
              <ListingCard key={l.slug} listing={l} index={i} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-[#2a1f25]/65">
            No matching properties right now.{' '}
            <Link href="/contact" className="text-[#371628] underline">
              Register your interest
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  )
}

function Reviews({s, content}: {s: LpSection; content: CmsContent}) {
  const items = content.reviews.slice(0, s.limit || 3)
  if (!items.length) return null
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-12">
        <Heading s={s} center />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((r) => (
            <figure key={r._id} className="rounded-3xl border border-gray-100 bg-[#FAF8F5] p-8">
              <Stars value={r.rating} />
              <blockquote className="mt-4 font-sans text-sm leading-relaxed text-[#2a1f25]/75">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-4 font-sans text-xs font-semibold text-[#2a1f25]">
                {r.authorName}
                {r.suburb ? `, ${r.suburb}` : ''}
                {r.source ? <span className="font-normal text-[#2a1f25]/45"> · {r.source}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBand({s}: {s: LpSection}) {
  return (
    <section className="container mx-auto px-6 py-16 md:px-12">
      <div className="rounded-3xl p-10 text-center text-white md:p-14" style={{background: BRAND_BG}}>
        <Heading s={s} light center />
        {text(s.body) && <p className="mx-auto -mt-4 mb-8 max-w-xl font-sans text-white/70">{text(s.body)}</p>}
        <CtaLink cta={s.cta} variant="light" />
      </div>
    </section>
  )
}

function FormSection({s}: {s: LpSection}) {
  return (
    <section id="form" className="scroll-mt-28 bg-[#FAF8F5] py-20">
      <div className="container mx-auto max-w-3xl px-6 md:px-12">
        <Heading s={s} />
        {text(s.body) && <p className="-mt-4 mb-8 font-sans text-[#2a1f25]/65">{text(s.body)}</p>}
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export default function LandingPageView({page, content}: {page: CmsLandingPage; content: CmsContent}) {
  const firstHeroIndex = page.sections.findIndex((x) => x._type === 'lpHero')
  const needsH1 = firstHeroIndex === -1
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF8F5]">
      {needsH1 && (
        <section className="pb-12 pt-36" style={{background: BRAND_BG}}>
          <div className="container mx-auto px-6 md:px-12">
            <h1 className="font-serif text-5xl font-normal text-white md:text-6xl">{page.title}</h1>
          </div>
        </section>
      )}
      {page.sections.map((s, i) => {
        const el = (() => {
          switch (s._type) {
            case 'lpHero':
              return <Hero s={s} isFirst={i === firstHeroIndex} />
            case 'lpText':
              return <TextSection s={s} />
            case 'lpImageText':
              return <ImageText s={s} />
            case 'lpCards':
              return <Cards s={s} />
            case 'lpSteps':
              return <Steps s={s} />
            case 'lpStats':
              return <Stats s={s} />
            case 'lpListings':
              return <Listings s={s} content={content} />
            case 'lpReviews':
              return <Reviews s={s} content={content} />
            case 'lpFaq':
              return (
                <FaqSection
                  faqs={(s.items ?? []).map((x) => ({question: x.question || '', answer: x.answer || ''}))}
                  heading={s.heading || 'Frequently asked questions'}
                />
              )
            case 'lpCta':
              return <CtaBand s={s} />
            case 'lpForm':
              return <FormSection s={s} />
            default:
              return null
          }
        })()
        return (
          <div key={s._key}>
            {el}
            {/* The short answer sits right under the first hero, where answer engines look first. */}
            {(i === firstHeroIndex || (needsH1 && i === 0)) && <AnswerBox seo={page.seo} />}
          </div>
        )
      })}
    </div>
  )
}
