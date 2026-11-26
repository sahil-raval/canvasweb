import {Star} from 'lucide-react'
import type {RatingSummary} from '@/lib/cms/reviews'

export function Stars({value, className = 'w-4 h-4 text-[#371628] fill-[#371628]'}: {value: number; className?: string}) {
  const full = Math.round(value)
  return (
    <span className="inline-flex" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={`${className} ${i > full ? 'opacity-25' : ''}`} />
      ))}
    </span>
  )
}

/** "4.9 from 37 Google reviews" with links to read and to leave a review. */
export function GoogleRatingLine({summary}: {summary: RatingSummary | null}) {
  if (!summary) return null
  const label = `${summary.rating.toFixed(1)}${summary.count ? ` from ${summary.count} Google reviews` : ' on Google'}`
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      <Stars value={summary.rating} />
      {summary.readUrl ? (
        <a href={summary.readUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-sm font-semibold text-gray-500 underline-offset-4 hover:underline">
          {label}
        </a>
      ) : (
        <span className="font-sans text-sm font-semibold text-gray-500">{label}</span>
      )}
    </div>
  )
}

/** Buttons under the reviews. Asking happy clients for Google reviews is what moves local ranking. */
export function ReviewActions({summary}: {summary: RatingSummary | null}) {
  if (!summary?.readUrl && !summary?.writeUrl) return null
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
      {summary.readUrl && (
        <a
          href={summary.readUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-xl border border-[#371628]/20 px-6 font-sans text-sm font-semibold text-[#371628] transition-colors hover:bg-[#371628]/5"
        >
          Read all reviews on Google
        </a>
      )}
      {summary.writeUrl && (
        <a
          href={summary.writeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-xl bg-[#371628] px-6 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#4a1e35]"
        >
          Worked with us? Leave a review
        </a>
      )}
    </div>
  )
}
