/**
 * POST /api/revalidate — called by a Sanity webhook when content is published,
 * so the website shows the change within seconds.
 * Auth: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` header, or `?secret=`.
 */
import {revalidateTag} from 'next/cache'
import {CMS_TAG} from '@/lib/cms/config'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  const given =
    new URL(req.url).searchParams.get('secret') || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!secret || given !== secret) return new Response('Unauthorised', {status: 401})
  revalidateTag(CMS_TAG, {expire: 0})
  return Response.json({revalidated: true, at: new Date().toISOString()})
}
