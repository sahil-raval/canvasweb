import Link from 'next/link'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/suburbs')
}

export default async function Page() {
  const content = await getContent()
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <section className="pb-16 pt-36" style={{background: 'linear-gradient(145deg, #371628 0%, #1a0d14 100%)'}}>
        <div className="container mx-auto px-6 md:px-12">
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Local knowledge</p>
          <h1 className="mb-4 font-serif text-5xl font-normal text-white md:text-6xl">Geelong suburbs we cover</h1>
          <p className="max-w-xl font-sans text-lg text-white/65">Suburb guides with current listings and recent sales.</p>
        </div>
      </section>
      <div className="container mx-auto grid grid-cols-1 gap-4 px-6 py-16 sm:grid-cols-2 md:px-12 lg:grid-cols-3">
        {content.suburbs.map((s) => (
          <Link key={s.slug} href={`/suburbs/${s.slug}`} className="rounded-2xl border border-[#371628]/10 bg-white p-6 transition-shadow hover:shadow-md">
            <h2 className="font-serif text-2xl text-[#2a1f25]">{s.name}</h2>
            {s.intro && <p className="mt-2 line-clamp-2 font-sans text-sm text-[#2a1f25]/60">{s.intro}</p>}
          </Link>
        ))}
        {!content.suburbs.length && <p className="font-sans text-[#2a1f25]/60">Suburb guides are coming soon.</p>}
      </div>
      <JsonLd data={breadcrumbSchema(content, [['Suburbs', '/suburbs']])} />
    </div>
  )
}
