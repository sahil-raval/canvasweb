import type {Metadata} from 'next'
import NotFound from '@/views/NotFound'

export const metadata: Metadata = {title: 'Page Not Found | Canvas Real Estate', robots: {index: false, follow: true}}

export default function Page() {
  return <NotFound />
}
