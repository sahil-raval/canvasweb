/**
 * FeedSync -> Sanity sync.
 *
 * Agentbox -> (XML files) -> FeedSync -> this sync -> Sanity -> website.
 * Nothing here writes to Agentbox or FeedSync. FeedSync is only read.
 */
import {isPublishable, LISTING_TYPES, parseFeed, RENTAL_TYPES, type FeedProperty} from './reaxml.js'
import {mutate, query, sanityConfig, uploadFromUrl, type SanityConfig} from './sanity.js'

interface FeedAsset {
  _key: string
  role: 'image' | 'floorPlan' | 'soi'
  url: string
  modTime: string
  assetId: string
}

interface ExistingDoc {
  _id: string
  _type: 'listing' | 'rental'
  slug?: string
  feedUniqueId?: string
  feedModTime?: string
  feedAssets?: FeedAsset[]
}

interface AgentDoc {
  _id: string
  name?: string
  email?: string
}

export interface SyncOptions {
  dryRun?: boolean
  force?: boolean
  /** Stop starting new uploads after this many ms (keeps us inside the function time limit). */
  timeBudgetMs?: number
}

export interface SyncReport {
  ok: boolean
  dryRun: boolean
  complete: boolean
  feedCounts: Record<string, number>
  created: string[]
  updated: string[]
  unchanged: string[]
  removed: string[]
  skipped: string[]
  warnings: string[]
  uploads: number
  durationMs: number
}

const FEED_TYPES = [...LISTING_TYPES, ...RENTAL_TYPES]

function feedUrl(type: string) {
  const base = process.env.FEEDSYNC_URL
  const key = process.env.FEEDSYNC_ACCESS_KEY
  if (!base || !key) throw new Error('FEEDSYNC_URL and FEEDSYNC_ACCESS_KEY must be set')
  const url = new URL(base)
  url.searchParams.set('action', 'do_output')
  url.searchParams.set('access_key', key)
  url.searchParams.set('type', type)
  return url.toString()
}

async function fetchFeed(type: string): Promise<FeedProperty[]> {
  const res = await fetch(feedUrl(type), {cache: 'no-store', headers: {Accept: 'application/xml,text/xml'}})
  if (!res.ok) throw new Error(`FeedSync ${type} returned ${res.status}`)
  const xml = await res.text()
  if (!xml.includes('<propertyList')) throw new Error(`FeedSync ${type} did not return REAXML`)
  return parseFeed(xml)
}

const docId = (p: FeedProperty) => `feedsync-${p.kind}-${p.uniqueId.replace(/[^a-zA-Z0-9_-]/g, '-')}`
const key = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').slice(-12) || Math.random().toString(36).slice(2, 10)
const imageRef = (assetId: string) => ({_type: 'image', asset: {_type: 'reference', _ref: assetId}})
const fileRef = (assetId: string) => ({_type: 'file', asset: {_type: 'reference', _ref: assetId}})

function matchAgents(p: FeedProperty, agents: AgentDoc[]) {
  const ids: string[] = []
  for (const a of p.agents) {
    const hit =
      agents.find((x) => a.email && x.email?.toLowerCase() === a.email) ||
      agents.find((x) => a.name && x.name?.trim().toLowerCase() === a.name.toLowerCase())
    if (hit && !ids.includes(hit._id)) ids.push(hit._id)
  }
  return ids
}

export async function runSync(opts: SyncOptions = {}): Promise<SyncReport> {
  const started = Date.now()
  const budget = opts.timeBudgetMs ?? 240_000
  const outOfTime = () => Date.now() - started > budget
  const report: SyncReport = {
    ok: true, dryRun: !!opts.dryRun, complete: true, feedCounts: {},
    created: [], updated: [], unchanged: [], removed: [], skipped: [], warnings: [], uploads: 0, durationMs: 0,
  }
  const c: SanityConfig = sanityConfig()

  // 1. Read every FeedSync output. If any type fails we stop before changing anything.
  const results = await Promise.all(FEED_TYPES.map((t) => fetchFeed(t).then((r) => [t, r] as const)))
  const all: FeedProperty[] = []
  for (const [t, props] of results) {
    report.feedCounts[t] = props.length
    all.push(...props)
  }

  // 2. Read what is already in Sanity (published documents only).
  const [existing, agents] = await Promise.all([
    query<ExistingDoc[]>(
      c,
      `*[_type in ["listing","rental"] && !(_id in path("drafts.**"))]{_id,_type,"slug":slug.current,feedUniqueId,feedModTime,feedAssets}`,
    ),
    query<AgentDoc[]>(c, `*[_type == "agent" && !(_id in path("drafts.**"))]{_id,name,email}`),
  ])

  const live = all.filter(isPublishable)
  for (const p of all.filter((x) => !isPublishable(x))) {
    report.skipped.push(`${p.address}, ${p.suburb} (${p.feedStatus}${p.hidden ? ', hidden' : ''})`)
  }

  // Keep slugs unique on the website.
  const usedSlugs = new Map<string, string>()
  for (const p of live) {
    const k = `${p.kind}:${p.slug}`
    if (usedSlugs.has(k) && usedSlugs.get(k) !== p.uniqueId) p.slug = `${p.slug}-${p.uniqueId.toLowerCase()}`
    usedSlugs.set(`${p.kind}:${p.slug}`, p.uniqueId)
  }

  const liveIds = new Set<string>()

  // 3. Create or update each live property.
  for (const p of live) {
    const label = `${p.address}, ${p.suburb}`
    const current =
      existing.find((d) => d._type === p.kind && d.feedUniqueId === p.uniqueId) ||
      // Adopt a hand-made document for the same address so we don't create a duplicate.
      existing.find((d) => d._type === p.kind && !d.feedUniqueId && d.slug === p.slug)
    const id = current?._id ?? docId(p)
    liveIds.add(id)

    if (current?.feedUniqueId && current.feedModTime === p.modTime && !opts.force) {
      report.unchanged.push(label)
      continue
    }
    if (!p.images.length) {
      report.warnings.push(`${label}: no photos in the feed yet, not published`)
      liveIds.delete(id)
      continue
    }
    if (opts.dryRun) {
      ;(current ? report.updated : report.created).push(label + (current && !current.feedUniqueId ? ' (linked to existing)' : ''))
      continue
    }

    // Re-use assets we already uploaded for the same source file.
    const known = current?.feedAssets ?? []
    const assets: FeedAsset[] = []
    let finished = true
    const want: Array<{role: FeedAsset['role']; url: string; modTime: string}> = [
      ...p.images.map((i) => ({role: 'image' as const, ...i})),
      ...(p.floorPlan ? [{role: 'floorPlan' as const, ...p.floorPlan}] : []),
      ...(p.soiPdf ? [{role: 'soi' as const, ...p.soiPdf}] : []),
    ]
    for (const w of want) {
      const hit = known.find((k) => k.role === w.role && k.url === w.url && k.modTime === w.modTime)
      if (hit) {
        assets.push(hit)
        continue
      }
      if (outOfTime()) {
        finished = false
        break
      }
      try {
        const assetId = await uploadFromUrl(c, w.url, w.role === 'soi' ? 'files' : 'images')
        report.uploads++
        assets.push({_key: key(`${w.role}${assets.length}${assetId}`), ...w, assetId})
      } catch (e) {
        report.warnings.push(`${label}: ${(e as Error).message}`)
      }
    }
    const photos = assets.filter((a) => a.role === 'image')
    if (!photos.length) {
      report.warnings.push(`${label}: photos could not be copied yet, will retry next run`)
      report.complete = false
      if (!current) liveIds.delete(id)
      continue
    }

    const floor = assets.find((a) => a.role === 'floorPlan')
    const soi = assets.find((a) => a.role === 'soi')
    const fields: Record<string, unknown> = {
      address: p.address,
      suburb: p.suburb,
      state: p.state,
      slug: {_type: 'slug', current: p.slug},
      type: p.type,
      beds: p.beds,
      baths: p.baths,
      cars: p.cars,
      land: p.land,
      heroImage: imageRef(photos[0].assetId),
      gallery: photos.slice(1, 31).map((a) => ({_key: a._key, ...imageRef(a.assetId)})),
      description: p.description,
      features: p.features,
      feedUniqueId: p.uniqueId,
      feedType: p.feedType,
      feedStatus: p.feedStatus,
      // Only mark as up to date when every file was copied; otherwise the next run finishes it.
      feedModTime: finished ? p.modTime : '',
      feedAssets: assets,
      feedSyncedAt: new Date().toISOString(),
    }
    const agentIds = matchAgents(p, agents)
    if (p.agents.length && !agentIds.length) {
      report.warnings.push(`${label}: agent "${p.agents.map((a) => a.name).join(', ')}" not found in the CMS`)
    }
    if (p.kind === 'listing') {
      Object.assign(fields, {
        price: p.price,
        status: p.status,
        agents: agentIds.map((ref) => ({_key: key(ref), _type: 'reference', _ref: ref})),
      })
      if (floor) fields.floorPlanImage = imageRef(floor.assetId)
      if (soi) fields.statementOfInformationPdf = fileRef(soi.assetId)
    } else {
      Object.assign(fields, {rentPw: p.rentPw, bond: p.bond, available: p.available})
      if (agentIds[0]) fields.agent = {_type: 'reference', _ref: agentIds[0]}
    }

    await mutate(c, [
      {createIfNotExists: {_id: id, _type: p.kind}},
      {patch: {id, set: fields}},
    ])
    if (!finished) report.complete = false
    ;(current ? report.updated : report.created).push(
      label + (current && !current.feedUniqueId ? ' (linked to existing)' : '') + (finished ? '' : ' (photos partly copied)'),
    )
  }

  // 4. Remove feed listings that are no longer in the feed (withdrawn, leased, off market).
  //    Hand-made documents (no feedUniqueId) are never removed.
  //    Safety: if the whole feed came back empty, remove nothing.
  if (all.length === 0) {
    report.warnings.push('FeedSync returned no properties at all, so nothing was removed')
  } else if (report.complete) {
    const stale = existing.filter((d) => d.feedUniqueId && !liveIds.has(d._id))
    for (const d of stale) report.removed.push(`${d.slug ?? d._id}`)
    if (!opts.dryRun) {
      await mutate(
        c,
        stale.flatMap((d) => [{delete: {id: d._id}}, {delete: {id: `drafts.${d._id}`}}]),
      )
    }
  }

  report.durationMs = Date.now() - started
  return report
}
