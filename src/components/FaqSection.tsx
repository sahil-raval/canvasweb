import type {Faq} from '@/lib/cms/types'

/**
 * Visible FAQ list (edited in Sanity). Uses native <details>, so it works without
 * JavaScript and the answers are in the HTML for search engines and AI assistants.
 */
export function FaqSection({faqs, heading = 'Frequently asked questions'}: {faqs?: Faq[] | null; heading?: string}) {
  const items = (faqs ?? []).filter((f) => f?.question && f?.answer)
  if (!items.length) return null
  return (
    <section aria-labelledby="faq-heading" className="bg-[#FAF8F5] py-20">
      <div className="container mx-auto max-w-3xl px-6 md:px-12">
        <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#371628]/50">Questions</p>
        <h2 id="faq-heading" className="mb-10 font-serif text-3xl text-[#2a1f25] md:text-4xl">
          {heading}
        </h2>
        <div className="divide-y divide-[#371628]/10 border-y border-[#371628]/10">
          {items.map((f) => (
            <details key={f.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-sans text-base font-medium text-[#2a1f25] marker:hidden">
                <h3 className="text-base font-medium">{f.question}</h3>
                <span aria-hidden className="mt-0.5 text-xl leading-none text-[#371628]/50 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-[#2a1f25]/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
