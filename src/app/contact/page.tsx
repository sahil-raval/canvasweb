import Contact from '@/views/Contact'
import {JsonLd} from '@/components/JsonLd'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {breadcrumbSchema, staticPageMetadata, STATIC_SEO} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/contact')
}

export default async function Page() {
  const content = await getContent()
  const name = STATIC_SEO['/contact'].title.split(' | ')[0]
  return (
    <>
      <CmsProvider content={scope(content, {pages: pagesFor(content, 'contact'), agents: content.agents})}>
        <Contact />
      </CmsProvider>
      <PageFaqs content={content} path="/contact" type="ContactPage" />
      <JsonLd data={breadcrumbSchema(content, [[name, '/contact']])} />
    </>
  )
}
