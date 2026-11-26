import {SoldListings} from '@/views/Listings'
import {isSold} from '@/lib/cms/listing'
import {JsonLd} from '@/components/JsonLd'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {breadcrumbSchema, itemListSchema, staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/sold')
}

export default async function Page() {
  const content = await getContent()
  const sold = content.listings.filter((l) => isSold(l.status))
  return (
    <>
      <CmsProvider content={scope(content, {listings: sold, pages: pagesFor(content, 'sold')})}>
        <SoldListings />
      </CmsProvider>
      <PageFaqs content={content} path="/sold" />
      <JsonLd data={[breadcrumbSchema(content, [['Sold', '/sold']]), itemListSchema(content, 'Properties sold by Canvas Real Estate', sold)]} />
    </>
  )
}
