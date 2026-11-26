import type {CmsContent, CmsReview, SiteSettings} from './types'

/**
 * Reviews shown before any are added in Sanity (Studio → Reviews).
 * Remove this list once the real reviews are entered there.
 */
const STARTER_REVIEWS: CmsReview[] = [
  {_id: 'starter-1', authorName: 'Monson C.', suburb: 'Charlemont', rating: 5, text: 'We really appreciate all the support and help from Pooja and the team at Canvas Real Estate throughout our rental process. The communication was always friendly, professional, and very quick, which made everything smooth and stress-free for our family. Pooja was very helpful, approachable, and supportive at every step, and the whole process was handled efficiently and fast. Thank you again for making our move much easier'},
  {_id: 'starter-2', authorName: 'Verified Seller', suburb: 'Leopold', rating: 5, text: 'Pooja was amazing to deal with whilst selling our home. Communication was fantastic and we were kept up to date every step of the way. Very flexible with her time and always willing to help however she could.'},
  {_id: 'starter-3', authorName: 'Verified Buyer', suburb: 'Leopold', rating: 5, text: 'Easy and Stress free, Pooja was easy to work with and patient. She made everything easy and seamless. Really enjoyed working with her.'},
  {_id: 'starter-4', authorName: 'Shishtika K.', suburb: 'Lara', rating: 5, text: 'i had the privilege to work with canvas reality. they had put up my rental property up very quickly in Geelong. Pooja was a very great help.'},
]

/** Reviews for the home page: featured Sanity reviews, else all Sanity reviews, else the starter list. */
export function homeReviews(c: Pick<CmsContent, 'reviews'>): CmsReview[] {
  const featured = c.reviews.filter((r) => r.featured !== false)
  return featured.length ? featured : c.reviews.length ? c.reviews : STARTER_REVIEWS
}

export interface RatingSummary {
  rating: number
  count?: number
  readUrl?: string
  writeUrl?: string
}

/** Google rating as entered in Site settings. Returns null when no rating is set, so nothing unverified is shown. */
export function googleRating(s: SiteSettings): RatingSummary | null {
  if (!s.googleRating) return null
  return {rating: s.googleRating, count: s.googleReviewCount, readUrl: s.googleReviewsUrl, writeUrl: s.googleWriteReviewUrl}
}
