/**
 * Tiny server-only Sanity HTTP client (no SDK needed).
 * Uses SANITY_WRITE_TOKEN, which must never be exposed to the browser.
 */
const API_VERSION = 'v2026-01-01'

export interface SanityConfig {
  projectId: string
  dataset: string
  token: string
}

export function sanityConfig(): SanityConfig {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'edbqqkej'
  const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
  const token = process.env.SANITY_WRITE_TOKEN || ''
  if (!token) throw new Error('SANITY_WRITE_TOKEN is not set')
  return {projectId, dataset, token}
}

const base = (c: SanityConfig) => `https://${c.projectId}.api.sanity.io/${API_VERSION}`

async function check(res: Response, what: string) {
  if (res.ok) return res
  const body = await res.text().catch(() => '')
  throw new Error(`${what} failed: ${res.status} ${body.slice(0, 300)}`)
}

export async function query<T>(c: SanityConfig, groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = new URL(`${base(c)}/data/query/${c.dataset}`)
  url.searchParams.set('query', groq)
  url.searchParams.set('perspective', 'raw')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
  const res = await check(
    await fetch(url, {headers: {Authorization: `Bearer ${c.token}`}, cache: 'no-store'}),
    'Sanity query',
  )
  return ((await res.json()) as {result: T}).result
}

export async function mutate(c: SanityConfig, mutations: unknown[]) {
  if (!mutations.length) return
  const res = await fetch(`${base(c)}/data/mutate/${c.dataset}?returnIds=false&visibility=sync`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations}),
  })
  await check(res, 'Sanity mutation')
}

/** Download a file from a URL and upload it to Sanity. Returns the asset _id. */
export async function uploadFromUrl(
  c: SanityConfig,
  sourceUrl: string,
  kind: 'images' | 'files',
): Promise<string> {
  const src = await fetch(sourceUrl)
  if (!src.ok) throw new Error(`Download failed (${src.status}) for ${sourceUrl}`)
  const body = await src.arrayBuffer()
  const contentType = src.headers.get('content-type') || (kind === 'images' ? 'image/jpeg' : 'application/pdf')
  const filename = decodeURIComponent(new URL(sourceUrl).pathname.split('/').pop() || 'file')
  const url = new URL(`${base(c)}/assets/${kind}/${c.dataset}`)
  url.searchParams.set('filename', filename)
  const res = await check(
    await fetch(url, {
      method: 'POST',
      headers: {Authorization: `Bearer ${c.token}`, 'Content-Type': contentType},
      body,
    }),
    'Sanity upload',
  )
  const json = (await res.json()) as {document?: {_id: string}}
  if (!json.document?._id) throw new Error('Sanity upload returned no asset id')
  return json.document._id
}
