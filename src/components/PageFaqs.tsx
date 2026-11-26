import {FaqSection} from '@/components/FaqSection'
import {JsonLd} from '@/components/JsonLd'
import type {CmsContent} from '@/lib/cms/types'
import {faqSchema, pageFor} from '@/lib/seo'

/** FAQs typed into the Sanity page for this route: shown on the page and marked up as FAQPage. */
export function PageFaqs({content, path}: {content: CmsContent; path: string}) {
  const faqs = pageFor(content, path)?.faqs
  const schema = faqSchema(faqs)
  if (!schema) return null
  return (
    <>
      <FaqSection faqs={faqs} />
      <JsonLd data={schema} />
    </>
  )
}
