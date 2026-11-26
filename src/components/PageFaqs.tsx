import {AnswerBox} from '@/components/AnswerBox'
import {FaqSection} from '@/components/FaqSection'
import {JsonLd} from '@/components/JsonLd'
import type {CmsContent} from '@/lib/cms/types'
import {faqSchema, pageFor, webPageSchema} from '@/lib/seo'

/**
 * Extra search content for a fixed route, edited on the matching Sanity page:
 * the short answer / key points box, FAQs, and the page-level structured data.
 */
export function PageFaqs({content, path, type}: {content: CmsContent; path: string; type?: string}) {
  const page = pageFor(content, path)
  const faq = faqSchema(page?.faqs)
  const webPage = page
    ? webPageSchema(content, {path, name: page.heading || page.title || '', description: page.intro, seo: page.seo, image: page.heroImage, dateModified: page._updatedAt, defaultType: type})
    : null
  return (
    <>
      <AnswerBox seo={page?.seo} />
      {faq && <FaqSection faqs={page?.faqs} />}
      {(faq || webPage) && <JsonLd data={[faq, webPage].filter((x): x is Record<string, unknown> => !!x)} />}
    </>
  )
}
