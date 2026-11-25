import {notFound} from 'next/navigation'
import ListingDetail from '@/views/ListingDetail'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, listingMetadata, listingSchema} from '@/lib/seo'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  return (await getContent()).listings.map((l) => ({slug: l.slug}))
}

export async function generateMetadata({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const listing = content.listings.find((l) => l.slug === slug)
  return listing ? listingMetadata(content, listing) : {}
}

export default async function Page({params}: Props) {
  const {slug} = await params
  const content = await getContent()
  const listing = content.listings.find((l) => l.slug === slug)
  if (!listing) notFound()
  const sold = listing.status === 'Sold'
  return (
    <>
      <ListingDetail />
      <JsonLd
        data={[
          listingSchema(content, listing),
          breadcrumbSchema(content, [
            sold ? ['Sold', '/sold'] : ['Property for sale', '/listings'],
            [`${listing.address}, ${listing.suburb}`, `/listings/${listing.slug}`],
          ]),
        ]}
      />
    </>
  )
}
