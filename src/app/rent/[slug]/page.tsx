import {notFound} from 'next/navigation'
import RentalDetail from '@/views/RentalDetail'
import {AnswerBox} from '@/components/AnswerBox'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {breadcrumbSchema, rentalMetadata, rentalSchema, webPageSchema} from '@/lib/seo'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  return (await getContent()).rentals.map((r) => ({slug: r.slug}))
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const rental = content.rentals.find((r) => r.slug === slug)
  return rental ? rentalMetadata(content, rental) : {}
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const rental = content.rentals.find((r) => r.slug === slug)
  if (!rental) notFound()
  return (
    <>
      <CmsProvider content={scope(content, {rentals: [rental], agents: content.agents})}>
        <RentalDetail />
      </CmsProvider>
      <AnswerBox seo={rental.seo} />
      <JsonLd data={[webPageSchema(content, {path: `/rent/${rental.slug}`, name: `${rental.address}, ${rental.suburb}`, seo: rental.seo}), rentalSchema(content, rental), breadcrumbSchema(content, [['Rent', '/rent'], [`${rental.address}, ${rental.suburb}`, `/rent/${rental.slug}`]])].filter((x): x is Record<string, unknown> => !!x)} />
    </>
  )
}
