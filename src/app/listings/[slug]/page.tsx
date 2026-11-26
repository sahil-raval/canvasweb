import {notFound} from 'next/navigation'
import ListingDetail from '@/views/ListingDetail'
import {AnswerBox} from '@/components/AnswerBox'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {breadcrumbSchema, listingMetadata, listingSchema, webPageSchema} from '@/lib/seo'

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
      <CmsProvider content={scope(content, {listings: [listing], agents: content.agents})}>
        <ListingDetail />
      </CmsProvider>
      <AnswerBox seo={listing.seo} />
      <JsonLd
        data={[
          webPageSchema(content, {path: `/listings/${listing.slug}`, name: `${listing.address}, ${listing.suburb}`, seo: listing.seo}),
          listingSchema(content, listing),
          breadcrumbSchema(content, [
            sold ? ['Sold', '/sold'] : ['Property for sale', '/listings'],
            [`${listing.address}, ${listing.suburb}`, `/listings/${listing.slug}`],
          ]),
        ].filter((x): x is Record<string, unknown> => !!x)}
      />
    </>
  )
}
