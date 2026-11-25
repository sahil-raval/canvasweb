import Journal from '@/views/Journal'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, staticPageMetadata, STATIC_SEO} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/journal')
}

export default async function Page() {
  const content = await getContent()
  const name = STATIC_SEO['/journal'].title.split(' | ')[0]
  return (
    <>
      <Journal />
      <JsonLd data={breadcrumbSchema(content, [[name, '/journal']])} />
    </>
  )
}
