import {notFound} from 'next/navigation'
import {AnswerBox} from '@/components/AnswerBox'
import LandingPageView from '@/views/LandingPageView'
import {FaqSection} from '@/components/FaqSection'
import {JsonLd} from '@/components/JsonLd'
import {RichSections} from '@/components/RichSections'
import {getContent} from '@/lib/cms/fetch'
import {RESERVED_PAGE_SLUGS} from '@/lib/cms/routes'
import type {CmsContent} from '@/lib/cms/types'
import {breadcrumbSchema, buildMetadata, faqSchema, landingMetadata, landingSchemas, webPageSchema} from '@/lib/seo'

/** Landing pages (built from sections) and general pages (e.g. Privacy Policy) created in Sanity. */
type Props = {params: Promise<{slug: string}>}

const findPage = (c: CmsContent, slug: string) =>
  RESERVED_PAGE_SLUGS.has(slug) ? undefined : c.pages.find((p) => p.slug === slug)
const findLanding = (c: CmsContent, slug: string) =>
  RESERVED_PAGE_SLUGS.has(slug) ? undefined : c.landingPages.find((p) => p.slug === slug)

export async function generateStaticParams() {
  const c = await getContent()
  const slugs = new Set([...c.landingPages.map((p) => p.slug), ...c.pages.map((p) => p.slug)])
  return [...slugs].filter((slug) => !RESERVED_PAGE_SLUGS.has(slug)).map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const c = await getContent()
  const landing = findLanding(c, slug)
  if (landing) return landingMetadata(c, landing)
  const page = findPage(c, slug)
  if (!page) return {}
  return buildMetadata(c, {
    path: `/${slug}`,
    title: `${page.title} | ${c.siteSettings.businessName}`,
    description: page.intro || `${page.title} - ${c.siteSettings.businessName}, Geelong.`,
    image: page.heroImage,
    modifiedTime: page._updatedAt,
    seo: page.seo,
  })
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const c = await getContent()
  const landing = findLanding(c, slug)
  if (landing) {
    return (
      <>
        <LandingPageView page={landing} content={c} />
        <JsonLd data={landingSchemas(c, landing)} />
      </>
    )
  }
  const page = findPage(c, slug)
  if (!page) notFound()
  const faq = faqSchema(page.faqs)
  const webPage = webPageSchema(c, {path: `/${slug}`, name: page.title || slug, description: page.intro, seo: page.seo, dateModified: page._updatedAt})
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <section className="pb-16 pt-36" style={{background: 'linear-gradient(145deg, #371628 0%, #1a0d14 100%)'}}>
        <div className="container mx-auto px-6 md:px-12">
          {page.eyebrow && <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">{page.eyebrow}</p>}
          <h1 className="mb-4 font-serif text-5xl font-normal text-white md:text-6xl">{page.heading || page.title}</h1>
          {page.intro && <p className="max-w-2xl font-sans text-lg text-white/65">{page.intro}</p>}
        </div>
      </section>
      <AnswerBox seo={page.seo} />
      <article className="container mx-auto max-w-3xl px-6 py-16 md:px-12">
        <RichSections sections={page.body} />
        {page._updatedAt && (
          <p className="mt-12 font-sans text-xs text-[#2a1f25]/40">
            Last updated {new Date(page._updatedAt).toLocaleDateString('en-AU', {day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
        )}
      </article>
      <FaqSection faqs={page.faqs} />
      <JsonLd data={[breadcrumbSchema(c, [[page.title || slug, `/${slug}`]]), ...(faq ? [faq] : []), ...(webPage ? [webPage] : [])]} />
    </div>
  )
}
