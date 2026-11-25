import {notFound} from 'next/navigation'
import RentalDetail from '@/views/RentalDetail'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, rentalMetadata, rentalSchema} from '@/lib/seo'

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
      <RentalDetail />
      <JsonLd data={[rentalSchema(content, rental), breadcrumbSchema(content, [['Rent', '/rent'], [`${rental.address}, ${rental.suburb}`, `/rent/${rental.slug}`]])]} />
    </>
  )
}
