import Link from 'next/link'
import {ListingCard} from '@/components/ListingCard'
import {AnswerBox} from '@/components/AnswerBox'
import {FaqSection} from '@/components/FaqSection'
import {RichSections} from '@/components/RichSections'
import {isSold} from '@/lib/cms/listing'
import type {CmsListing, CmsSuburb} from '@/lib/cms/types'

const norm = (s?: string) => (s || '').toLowerCase().trim()

/** Listings from Agentbox whose suburb matches this suburb page. */
export const listingsIn = (sub: CmsSuburb, listings: CmsListing[]) => listings.filter((l) => norm(l.suburb) === norm(sub.name))

export default function SuburbView({suburb, listings}: {suburb: CmsSuburb; listings: CmsListing[]}) {
  const local = listingsIn(suburb, listings)
  const current = local.filter((l) => !isSold(l.status))
  const sold = local.filter((l) => isSold(l.status))
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF8F5]">
      <section
        className="relative overflow-hidden pb-20 pt-36"
        style={{
          backgroundImage: suburb.heroImage
            ? `linear-gradient(145deg, rgba(55,22,40,0.88) 0%, rgba(26,13,20,0.82) 100%), url("${suburb.heroImage}")`
            : 'linear-gradient(145deg, #371628 0%, #1a0d14 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
            <Link href="/suburbs" className="hover:text-white">
              Suburbs
            </Link>{' '}
            / {suburb.name}
          </nav>
          <h1 className="mb-4 font-serif text-5xl font-normal text-white md:text-6xl">
            {suburb.heading || `Real estate in ${suburb.name}`}
          </h1>
          {suburb.intro && <p className="max-w-2xl font-sans text-lg text-white/70">{suburb.intro}</p>}
        </div>
      </section>

      <AnswerBox seo={suburb.seo} />

      {!!suburb.body?.length && (
        <section className="container mx-auto max-w-3xl px-6 py-16 md:px-12">
          <RichSections sections={suburb.body} />
        </section>
      )}

      <section className="container mx-auto px-6 py-12 md:px-12">
        <h2 className="mb-8 font-serif text-3xl text-[#2a1f25]">Property for sale in {suburb.name}</h2>
        {current.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {current.map((l, i) => (
              <ListingCard key={l.slug} listing={l} index={i} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-[#2a1f25]/70">
            Nothing listed in {suburb.name} right now.{' '}
            <Link href="/contact" className="text-[#371628] underline">
              Register your interest
            </Link>{' '}
            and we will tell you first.
          </p>
        )}
      </section>

      {!!sold.length && (
        <section className="container mx-auto px-6 py-12 md:px-12">
          <h2 className="mb-8 font-serif text-3xl text-[#2a1f25]">Recently sold in {suburb.name}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {sold.map((l, i) => (
              <ListingCard key={l.slug} listing={l} index={i} />
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={suburb.faqs} heading={`${suburb.name} property questions`} />

      <section className="container mx-auto px-6 pb-20 md:px-12">
        <div className="rounded-3xl p-10 text-center text-white md:p-14" style={{background: 'linear-gradient(145deg, #371628 0%, #1a0d14 100%)'}}>
          <h2 className="mb-4 font-serif text-3xl md:text-4xl">Thinking of selling in {suburb.name}?</h2>
          <p className="mx-auto mb-8 max-w-xl font-sans text-white/65">Get a free, no-obligation appraisal from a local agent.</p>
          <Link href="/contact" className="inline-flex h-12 items-center rounded-2xl bg-white px-10 text-sm font-bold text-[#371628] hover:bg-white/90">
            Book an appraisal
          </Link>
        </div>
      </section>
    </div>
  )
}
