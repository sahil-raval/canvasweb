import Journal from '@/views/Journal'
import {JsonLd} from '@/components/JsonLd'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'

import {breadcrumbSchema, staticPageMetadata, STATIC_SEO} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/journal')
}

export default async function Page() {
  const content = await getContent()
  const name = STATIC_SEO['/journal'].title.split(' | ')[0]
  return (
    <>
      <CmsProvider content={scope(content, {articles: content.articles.map((a) => ({...a, body: []})), pages: pagesFor(content, 'journal')})}>
        <Journal />
      </CmsProvider>
      <PageFaqs content={content} path="/journal" type="CollectionPage" />
      <JsonLd data={breadcrumbSchema(content, [[name, '/journal']])} />
    </>
  )
}
