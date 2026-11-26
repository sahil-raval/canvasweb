import {notFound} from 'next/navigation'
import SuburbView, {listingsIn} from '@/views/SuburbView'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, faqSchema, itemListSchema, suburbMetadata, suburbSchema} from '@/lib/seo'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  return (await getContent()).suburbs.map((s) => ({slug: s.slug}))
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const suburb = content.suburbs.find((s) => s.slug === slug)
  return suburb ? suburbMetadata(content, suburb) : {}
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const suburb = content.suburbs.find((s) => s.slug === slug)
  if (!suburb) notFound()
  const data = [
    suburbSchema(content, suburb),
    breadcrumbSchema(content, [['Suburbs', '/suburbs'], [suburb.name, `/suburbs/${suburb.slug}`]]),
    itemListSchema(content, `Property in ${suburb.name}`, listingsIn(suburb, content.listings)),
    faqSchema(suburb.faqs),
  ].filter((x): x is Record<string, unknown> => !!x)
  return (
    <>
      <SuburbView suburb={suburb} listings={content.listings} />
      <JsonLd data={data} />
    </>
  )
}
