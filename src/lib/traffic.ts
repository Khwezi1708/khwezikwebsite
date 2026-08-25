import { trackedPaths, trafficNamespace } from '../data/analytics'

const ABACUS = 'https://abacus.jasoncameron.dev'
const VISITOR_KEY = 'kk_traffic_vid'
const UNIQUE_FLAG = 'kk_traffic_unique'
const PATH_SESSION = 'kk_traffic_paths'
const REF_SESSION = 'kk_traffic_ref'

type CounterValue = { value?: number }

const dayKey = (date = new Date()) => {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `day-${y}-${m}-${d}`
}

const sanitizeKey = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'other'

async function abacus(method: 'hit' | 'get', key: string): Promise<number> {
  const safe = sanitizeKey(key)
  const response = await fetch(`${ABACUS}/${method}/${trafficNamespace}/${safe}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
  })
  if (!response.ok) return 0
  const data = (await response.json().catch(() => null)) as CounterValue | null
  return typeof data?.value === 'number' ? data.value : 0
}

export async function hitCounter(key: string): Promise<number> {
  try {
    return await abacus('hit', key)
  } catch {
    return 0
  }
}

export async function getCounter(key: string): Promise<number> {
  try {
    return await abacus('get', key)
  } catch {
    return 0
  }
}

function visitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return 'anonymous'
  }
}

function sessionSet(key: string): Set<string> {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set()
  } catch {
    return new Set()
  }
}

function sessionAdd(key: string, value: string) {
  const set = sessionSet(key)
  if (set.has(value)) return false
  set.add(value)
  try {
    sessionStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // ignore quota
  }
  return true
}

function resolvePathId(): string {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const hash = window.location.hash.split('?')[0] || ''
  for (const entry of trackedPaths) {
    if (entry.match(path, hash)) return entry.id
  }
  if (path.includes('hiddenanalytics')) return 'analytics'
  return 'other'
}

function resolveReferrerHost(): string {
  try {
    const ref = document.referrer
    if (!ref) return 'direct'
    const host = new URL(ref).hostname.replace(/^www\./, '')
    if (!host || host === window.location.hostname) return 'direct'
    return sanitizeKey(host)
  } catch {
    return 'direct'
  }
}

/** Record a pageview for the public site (skip the analytics dashboard). */
export async function recordPageview(): Promise<void> {
  if (typeof window === 'undefined') return
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/hiddenanalytics') return

  visitorId()

  const tasks: Promise<number>[] = [hitCounter('pageviews'), hitCounter(dayKey())]

  const pathId = resolvePathId()
  if (sessionAdd(PATH_SESSION, pathId)) {
    tasks.push(hitCounter(`path-${pathId}`))
  }

  try {
    if (!localStorage.getItem(UNIQUE_FLAG)) {
      localStorage.setItem(UNIQUE_FLAG, '1')
      tasks.push(hitCounter('uniques'))
    }
  } catch {
    // private mode
  }

  const refHost = resolveReferrerHost()
  if (sessionAdd(REF_SESSION, refHost)) {
    tasks.push(hitCounter(`ref-${refHost}`))
  }

  await Promise.allSettled(tasks)
}

export type TrafficSnapshot = {
  pageviews: number
  uniques: number
  today: number
  paths: { id: string; label: string; count: number }[]
  days: { key: string; label: string; count: number }[]
  referrers: { host: string; count: number }[]
}

function lastDayKeys(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
    const key = dayKey(date)
    const label = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    })
    out.push({ key, label })
  }
  return out
}

export async function loadTrafficSnapshot(): Promise<TrafficSnapshot> {
  const dayMeta = lastDayKeys(14)
  const pathDefs = trackedPaths.map((p) => ({ id: p.id, label: p.label }))

  const [pageviews, uniques, today, ...rest] = await Promise.all([
    getCounter('pageviews'),
    getCounter('uniques'),
    getCounter(dayKey()),
    ...pathDefs.map((p) => getCounter(`path-${p.id}`)),
    ...dayMeta.map((d) => getCounter(d.key)),
  ])

  const pathCounts = rest.slice(0, pathDefs.length)
  const dayCounts = rest.slice(pathDefs.length)

  const paths = pathDefs
    .map((p, i) => ({ id: p.id, label: p.label, count: pathCounts[i] ?? 0 }))
    .sort((a, b) => b.count - a.count)

  const days = dayMeta.map((d, i) => ({
    key: d.key,
    label: d.label,
    count: dayCounts[i] ?? 0,
  }))

  // Known / common referrers to surface; others stay in totals only
  const refHosts = [
    'direct',
    'instagram.com',
    'l.instagram.com',
    'tiktok.com',
    'youtube.com',
    'youtu.be',
    'soundcloud.com',
    'google.com',
    'bing.com',
    'facebook.com',
    't.co',
    'linkedin.com',
  ]
  const referrerCounts = await Promise.all(refHosts.map((h) => getCounter(`ref-${sanitizeKey(h)}`)))
  const referrers = refHosts
    .map((host, i) => ({ host, count: referrerCounts[i] ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)

  return { pageviews, uniques, today, paths, days, referrers }
}
