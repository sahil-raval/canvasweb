import Listings from '@/views/Listings'
import {isSold} from '@/lib/cms/listing'
import {JsonLd} from '@/components/JsonLd'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, itemListSchema, staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/listings')
}

export default async function Page() {
  const content = await getContent()
  const current = content.listings.filter((l) => !isSold(l.status))
  return (
    <>
      <Listings />
      <PageFaqs content={content} path="/listings" />
      <JsonLd data={[breadcrumbSchema(content, [['Property for sale', '/listings']]), itemListSchema(content, 'Property for sale in Geelong', current)]} />
    </>
  )
}
