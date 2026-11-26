import Home from '@/views/Home'
import {PageFaqs} from '@/components/PageFaqs'
import {getContent} from '@/lib/cms/fetch'
import {staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/')
}

export default async function Page() {
  const content = await getContent()
  return (
    <>
      <Home />
      <PageFaqs content={content} path="/" />
    </>
  )
}
