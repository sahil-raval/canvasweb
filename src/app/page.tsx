import Home from '@/views/Home'
import {getContent} from '@/lib/cms/fetch'
import {staticPageMetadata} from '@/lib/seo'

export async function generateMetadata() {
  return staticPageMetadata(await getContent(), '/')
}

export default function Page() {
  return <Home />
}
