export type Gig = {
  id: string
  eventName: string
  venue?: string
  city: string
  country: string
  dateLabel: string
  timeLabel: string
  isPast: boolean
  ticketUrl?: string
}

export { gigs } from './gigs.generated'
