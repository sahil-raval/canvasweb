import Home from '@/views/Home'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {CmsProvider} from '@/lib/cms/context'
import {pagesFor, scope} from '@/lib/cms/scope'
import {isSold} from '@/lib/cms/listing'

import {staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/')
}

export default async function Page() {
  const content = await getContent()
  return (
    <>
      <CmsProvider content={scope(content, {listings: content.listings.filter((l) => !isSold(l.status)), pages: pagesFor(content, 'home', '/'), reviews: content.reviews, agents: content.agents})}>
        <Home />
      </CmsProvider>
      <PageFaqs content={content} path="/" />
    </>
  )
}
