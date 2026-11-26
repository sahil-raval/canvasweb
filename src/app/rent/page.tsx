import Rent from '@/views/Rent'
import {JsonLd} from '@/components/JsonLd'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, staticPageMetadata, STATIC_SEO} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/rent')
}

export default async function Page() {
  const content = await getContent()
  const name = STATIC_SEO['/rent'].title.split(' | ')[0]
  return (
    <>
      <Rent />
      <PageFaqs content={content} path="/rent" />
      <JsonLd data={breadcrumbSchema(content, [[name, '/rent']])} />
    </>
  )
}
