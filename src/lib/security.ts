import 'server-only'
import {createHash, timingSafeEqual} from 'node:crypto'

const digest = (s: string) => createHash('sha256').update(s).digest()

/** Compare a given secret with the allowed ones in constant time. */
export function secretMatches(given: string | null | undefined, allowed: Array<string | undefined>): boolean {
  if (!given) return false
  const g = digest(given)
  return allowed.filter((s): s is string => !!s && s.length >= 12).some((s) => timingSafeEqual(g, digest(s)))
}

/** Secret from `Authorization: Bearer …`, falling back to a query parameter. */
export function secretFrom(req: Request, queryName: string): string | null {
  const header = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
  return header || new URL(req.url).searchParams.get(queryName)
}

/**
 * Small per-IP rate limit for public forms. Serverless instances do not share memory,
 * so this only slows down a burst; it is not a full defence.
 */
const hits = new Map<string, number[]>()
export function rateLimited(req: Request, limit = 5, windowMs = 10 * 60_000): boolean {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > limit
}
