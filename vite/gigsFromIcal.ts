import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ical, { type DateWithTimeZone, type VEvent } from 'node-ical'
import type { Gig } from '../src/data/gigs'

const moduleDir = dirname(fileURLToPath(import.meta.url))
const OUTPUT = resolve(moduleDir, '../src/data/gigs.generated.ts')

const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/i

type ParsedGig = Gig & { startMs: number }

function escapeTsString(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

function asText(value: string | { val: string } | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'string' ? value : value.val
}

type ParsedPlace = {
  venue?: string
  city: string
  country: string
}

function parseCityCountry(
  location: string,
  parts: string[],
): { city: string; country: string } {
  if (parts.length === 0) return { city: '', country: '' }
  if (parts.length === 1) return { city: parts[0], country: '' }

  const country = normalizeCountry(parts[parts.length - 1])

  if (parts.length === 2 && parts[0].length <= 40 && !/\d{3,}/.test(parts[0])) {
    return { city: parts[0], country }
  }

  const nlCity = location.match(/\b\d{4}\s*[A-Z]{2}\s+([A-Za-zÀ-ÿ' -]+)/i)
  if (nlCity) {
    return { city: nlCity[1].trim(), country }
  }

  const ukCity = location.match(
    /,\s*([A-Za-z][A-Za-z\s'-]*?[A-Za-z])\s+[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i,
  )
  if (ukCity) {
    return { city: ukCity[1].trim(), country }
  }

  if (parts.length >= 2) {
    const maybeCity = parts[parts.length - 2]
    if (maybeCity.length <= 32 && !/\d/.test(maybeCity)) {
      return { city: maybeCity, country }
    }
  }

  return { city: parts[0], country }
}

function parseLocation(raw: string | undefined): ParsedPlace {
  const location = raw?.trim() ?? ''
  if (!location) return { city: '', country: '' }

  const parts = location.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return { city: '', country: '' }

  // Full address: first segment is the venue
  if (parts.length >= 3) {
    const venue = parts[0]
    const remainderParts = parts.slice(1)
    const { city, country } = parseCityCountry(
      remainderParts.join(', '),
      remainderParts,
    )
    return { venue, city, country }
  }

  const { city, country } = parseCityCountry(location, parts)
  return { city, country }
}

function normalizeCountry(value: string): string {
  const lower = value.toLowerCase()
  if (lower === 'united kingdom') return 'UK'
  if (lower === 'the netherlands') return 'NL'
  if (lower === 'netherlands') return 'NL'
  return value
}

function extractTicketUrl(description: string | undefined): string | undefined {
  if (!description) return undefined
  const match = description.match(URL_REGEX)
  return match?.[0]
}

function toDate(value: DateWithTimeZone): Date {
  return value
}

function isAllDay(start: Date, end: Date | undefined): boolean {
  if (end && end.getTime() - start.getTime() >= 24 * 60 * 60 * 1000) {
    return true
  }
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    (!end ||
      (end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end.getDate() !== start.getDate()))
  )
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatTimeLabel(date: Date, allDay: boolean): string {
  if (allDay) return 'All day'
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function mapEvent(uid: string, event: VEvent, now: number): ParsedGig | null {
  if (!event.start) return null

  const title = asText(event.summary)?.trim()
  const start = toDate(event.start)
  const end = event.end ? toDate(event.end) : undefined
  const startMs = start.getTime()
  const allDay = isAllDay(start, end)
  const { venue: venueFromAddress, city, country } = parseLocation(
    asText(event.location),
  )
  const ticketUrl = extractTicketUrl(asText(event.description))
  const venue = venueFromAddress
  const eventName = title ?? ''

  if (!eventName && !venue && !city && !country) return null

  const gig: ParsedGig = {
    id: uid,
    eventName,
    city,
    country,
    dateLabel: formatDateLabel(start),
    timeLabel: formatTimeLabel(start, allDay),
    isPast: startMs < now,
    startMs,
  }

  if (venue) gig.venue = venue
  if (ticketUrl) gig.ticketUrl = ticketUrl
  return gig
}

function yearStartMs(nowMs: number) {
  const now = new Date(nowMs)
  return new Date(now.getFullYear(), 0, 1).getTime()
}

function selectGigs(items: ParsedGig[], nowMs: number): Gig[] {
  const fromMs = yearStartMs(nowMs)

  const upcoming = items
    .filter((gig) => !gig.isPast)
    .sort((a, b) => a.startMs - b.startMs)

  // Past gigs from the start of the current calendar year (newest first)
  const past = items
    .filter((gig) => gig.isPast && gig.startMs >= fromMs)
    .sort((a, b) => b.startMs - a.startMs)

  return [...upcoming, ...past].map(({ startMs: _startMs, ...gig }) => gig)
}

export async function fetchGigsFromIcal(url: string): Promise<Gig[]> {
  const data = await ical.async.fromURL(url)
  const now = Date.now()
  const parsed: ParsedGig[] = []

  for (const [uid, entry] of Object.entries(data)) {
    if (!entry || entry.type !== 'VEVENT') continue
    const gig = mapEvent(uid, entry, now)
    if (gig) parsed.push(gig)
  }

  return selectGigs(parsed, now)
}

function serializeGigs(gigs: Gig[]): string {
  const rows = gigs
    .map((gig) => {
      const venue = gig.venue
        ? `\n    venue: '${escapeTsString(gig.venue)}',`
        : ''
      const ticket = gig.ticketUrl
        ? `\n    ticketUrl: '${escapeTsString(gig.ticketUrl)}',`
        : ''
      return `  {
    id: '${escapeTsString(gig.id)}',
    eventName: '${escapeTsString(gig.eventName)}',${venue}
    city: '${escapeTsString(gig.city)}',
    country: '${escapeTsString(gig.country)}',
    dateLabel: '${escapeTsString(gig.dateLabel)}',
    timeLabel: '${escapeTsString(gig.timeLabel)}',
    isPast: ${gig.isPast},${ticket}
  }`
    })
    .join(',\n')

  return `import type { Gig } from './gigs'

/** Auto-generated from Google Calendar iCal — do not edit by hand. */
export const gigs: Gig[] = [
${rows}
]
`
}

const DEMO_GIGS: Gig[] = [
  {
    id: 'demo-upcoming-1',
    eventName: 'KHWEZI K at De School',
    venue: 'De School',
    city: 'Amsterdam',
    country: 'NL',
    dateLabel: 'Sat 12 Sep 2026',
    timeLabel: '23:00',
    isPast: false,
    ticketUrl: 'https://example.com/tickets',
  },
  {
    id: 'demo-upcoming-2',
    eventName: 'Sunset grooves',
    venue: 'Maassilo',
    city: 'Rotterdam',
    country: 'NL',
    dateLabel: 'Fri 2 Oct 2026',
    timeLabel: '22:00',
    isPast: false,
  },
  {
    id: 'demo-past-1',
    eventName: 'Amapiano Worldwide',
    venue: 'Basing House',
    city: 'London',
    country: 'UK',
    dateLabel: 'Fri 28 Aug 2026',
    timeLabel: '23:30',
    isPast: true,
  },
  {
    id: 'demo-past-2',
    eventName: 'Warehouse session',
    venue: 'Garage Noord',
    city: 'Amsterdam',
    country: 'NL',
    dateLabel: 'Sat 12 Jul 2026',
    timeLabel: '23:00',
    isPast: true,
  },
  {
    id: 'demo-past-3',
    eventName: 'Rooftop grooves',
    city: 'Berlin',
    country: 'DE',
    dateLabel: 'Fri 20 Jun 2026',
    timeLabel: '22:00',
    isPast: true,
  },
  {
    id: 'demo-past-4',
    eventName: 'Club night',
    venue: 'RADION',
    city: 'Amsterdam',
    country: 'NL',
    dateLabel: 'Sat 9 May 2026',
    timeLabel: '23:30',
    isPast: true,
  },
  {
    id: 'demo-past-5',
    eventName: 'Spring warm-up',
    city: 'Cape Town',
    country: 'ZA',
    dateLabel: 'Sat 11 Apr 2026',
    timeLabel: '20:00',
    isPast: true,
  },
  {
    id: 'demo-past-6',
    eventName: 'Equinox set',
    city: 'Lisbon',
    country: 'PT',
    dateLabel: 'Fri 20 Mar 2026',
    timeLabel: '23:00',
    isPast: true,
  },
  {
    id: 'demo-past-7',
    eventName: 'Late winter session',
    city: 'Paris',
    country: 'FR',
    dateLabel: 'Sat 14 Feb 2026',
    timeLabel: '22:00',
    isPast: true,
  },
  {
    id: 'demo-past-8',
    eventName: 'New year opener',
    city: 'Johannesburg',
    country: 'ZA',
    dateLabel: 'Fri 9 Jan 2026',
    timeLabel: '21:00',
    isPast: true,
  },
]

export async function writeGigsFromCalendar(options?: {
  url?: string
  mode?: string
}): Promise<Gig[]> {
  const url = options?.url?.trim() ?? process.env.GOOGLE_CALENDAR_ICAL_URL?.trim()
  const isDev = options?.mode === 'development'
  let gigs: Gig[] = []

  if (!url) {
    console.warn(
      'fetch-gigs: GOOGLE_CALENDAR_ICAL_URL not set — writing empty gigs list.',
    )
  } else {
    try {
      gigs = await fetchGigsFromIcal(url)
      console.log(`fetch-gigs: loaded ${gigs.length} gig(s) from calendar.`)
    } catch (error) {
      console.warn(
        'fetch-gigs: calendar fetch failed — writing empty gigs list.',
        error,
      )
    }
  }

  if (gigs.length === 0 && isDev) {
    gigs = DEMO_GIGS
    console.log('fetch-gigs: using demo gigs for local preview.')
  }

  writeFileSync(OUTPUT, serializeGigs(gigs), 'utf8')
  return gigs
}
