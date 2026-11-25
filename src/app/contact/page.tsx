import Contact from '@/views/Contact'
import {JsonLd} from '@/components/JsonLd'
import {getContent} from '@/lib/cms/fetch'
import {breadcrumbSchema, staticPageMetadata, STATIC_SEO} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/contact')
}

export default async function Page() {
  const content = await getContent()
  const name = STATIC_SEO['/contact'].title.split(' | ')[0]
  return (
    <>
      <Contact />
      <JsonLd data={breadcrumbSchema(content, [[name, '/contact']])} />
    </>
  )
}
