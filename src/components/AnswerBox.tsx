import type {SeoFields} from '@/lib/cms/types'

/**
 * "In short" box: the short answer, key points, who checked it and the sources.
 * Answer engines quote text that is visible on the page, so the AEO/GEO fields are shown here.
 */
export function AnswerBox({seo, className = ''}: {seo?: SeoFields | null; className?: string}) {
  const s = seo ?? {}
  const points = (s.keyTakeaways ?? []).filter(Boolean)
  const sources = (s.sources ?? []).filter((x) => x?.url && x?.title)
  if (!s.answerSummary && !points.length) return null
  const reviewed = s.lastReviewed
    ? new Date(s.lastReviewed).toLocaleDateString('en-AU', {day: 'numeric', month: 'long', year: 'numeric'})
    : null
  return (
    <section aria-label="Summary" className={`bg-[#FAF8F5] py-12 ${className}`}>
      <div className="container mx-auto max-w-3xl px-6 md:px-12">
        <div className="rounded-2xl border border-[#371628]/12 bg-white p-7 md:p-9">
          <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#371628]/55">In short</p>
          {s.answerSummary && (
            <p className="answer-summary font-serif text-xl leading-relaxed text-[#2a1f25] md:text-2xl">{s.answerSummary}</p>
          )}
          {!!points.length && (
            <ul className="mt-6 space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex gap-3 font-sans text-sm leading-relaxed text-[#2a1f25]/80">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#371628]" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {(s.reviewedBy || reviewed || sources.length > 0) && (
            <div className="mt-7 border-t border-[#371628]/10 pt-5 font-sans text-xs leading-relaxed text-[#2a1f25]/55">
              {(s.reviewedBy || reviewed) && (
                <p>
                  {s.reviewedBy ? <>Checked by {s.reviewedBy.name}{s.reviewedBy.role ? `, ${s.reviewedBy.role}` : ''}</> : 'Last checked'}
                  {reviewed ? ` on ${reviewed}` : ''}.
                </p>
              )}
              {!!sources.length && (
                <p className="mt-1">
                  Sources:{' '}
                  {sources.map((x, i) => (
                    <span key={x.url}>
                      {i > 0 && ', '}
                      <a href={x.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#371628]">
                        {x.title}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
