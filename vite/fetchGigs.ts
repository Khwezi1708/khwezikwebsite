import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { writeGigsFromCalendar } from './gigsFromIcal'

/** Runs at production build time only (prebuild handles dev). */
export function fetchGigs(): Plugin {
  return {
    name: 'fetch-gigs',
    apply: 'build',
    async buildStart() {
      const env = loadEnv('production', process.cwd(), '')
      await writeGigsFromCalendar({
        url: env.GOOGLE_CALENDAR_ICAL_URL,
        mode: 'production',
      })
    },
  }
}
