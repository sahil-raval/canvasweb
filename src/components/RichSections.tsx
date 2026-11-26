import type {CmsSuburb} from '@/lib/cms/types'

type Section = NonNullable<CmsSuburb['body']>[number]

/** Renders paragraph / heading / pull-quote / divider sections edited in Sanity. */
export function RichSections({sections}: {sections?: Section[] | null}) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((b, i) =>
        b.type === 'heading' ? (
          <h2 key={b._key ?? i} className="mb-4 mt-10 font-serif text-3xl text-[#2a1f25]">
            {b.text}
          </h2>
        ) : b.type === 'pullquote' ? (
          <blockquote key={b._key ?? i} className="my-8 border-l-2 border-[#371628]/30 pl-6 font-serif text-xl italic text-[#371628]">
            {b.text}
          </blockquote>
        ) : b.type === 'divider' ? (
          <hr key={b._key ?? i} className="my-10 border-[#371628]/10" />
        ) : (
          <p key={b._key ?? i} className="mb-5 whitespace-pre-line font-sans leading-relaxed text-[#2a1f25]/75">
            {b.text}
          </p>
        ),
      )}
    </>
  )
}
