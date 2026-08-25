import { loadEnv } from 'vite'
import { writeGigsFromCalendar } from './gigsFromIcal'

const env = loadEnv('development', process.cwd(), '')

await writeGigsFromCalendar({
  url: env.GOOGLE_CALENDAR_ICAL_URL,
  mode: 'development',
})
