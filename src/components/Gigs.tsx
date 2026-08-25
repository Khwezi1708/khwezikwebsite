import { motion } from 'framer-motion'
import { gigs, type Gig } from '../data/gigs'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import './Gigs.css'

const easeOut = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.2 } as const

function TicketCell({ gig }: { gig: Gig }) {
  if (gig.ticketUrl) {
    return (
      <a
        className="gig__tickets gig__tickets--link"
        href={gig.ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Tickets
      </a>
    )
  }

  if (gig.isPast) {
    return <span className="gig__tickets gig__tickets--muted">—</span>
  }

  return <span className="gig__tickets gig__tickets--muted">TBA</span>
}

function formatLocale(city: string, country: string) {
  if (city && country) return `${city}, ${country}`
  return city || country
}

function formatPlace(gig: Gig) {
  const locale = formatLocale(gig.city, gig.country)
  return [gig.venue, locale].filter(Boolean).join(', ')
}

function GigRow({
  gig,
  soft,
  index = 0,
}: {
  gig: Gig
  soft: boolean
  index?: number
}) {
  const place = formatPlace(gig)
  const className = `gig${gig.isPast ? ' gig--past' : ''}`

  const content = (
    <>
      <div className="gig__place">
        {gig.eventName ? <p className="gig__event">{gig.eventName}</p> : null}
        {place ? <p className="gig__detail">{place}</p> : null}
      </div>

      <div className="gig__when">
        <p className="gig__date">{gig.dateLabel}</p>
        <p className="gig__time">{gig.timeLabel}</p>
      </div>

      <div className="gig__action">
        <TicketCell gig={gig} />
      </div>
    </>
  )

  if (soft) {
    return <li className={className}>{content}</li>
  }

  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.65, ease: easeOut, delay: index * 0.05 }}
    >
      {content}
    </motion.li>
  )
}

function GigsHeader({ soft }: { soft: boolean }) {
  if (soft) {
    return (
      <>
        <p className="section-label">04 · Gigs</p>
        <h2 className="gigs__headline">
          <span>It&apos;s better IRL.</span>
          <span className="gigs__headline-accent">come through</span>
        </h2>
        <p className="gigs__lede">Be there for a KHWEZI K set in person</p>
      </>
    )
  }

  return (
    <>
      <motion.p
        className="section-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        04 · Gigs
      </motion.p>
      <h2 className="gigs__headline">
        <motion.span
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={viewport}
          transition={{ duration: 0.75, ease: easeOut, delay: 0.06 }}
        >
          It&apos;s better IRL.
        </motion.span>
        <motion.span
          className="gigs__headline-accent"
          initial={{ opacity: 0, x: -56 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.85, ease: easeOut, delay: 0.18 }}
        >
          come through
        </motion.span>
      </h2>
      <motion.p
        className="gigs__lede"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.28 }}
      >
        Be there for a KHWEZI K set in person
      </motion.p>
    </>
  )
}

function GigsContent({ soft }: { soft: boolean }) {
  const hasGigs = gigs.length > 0

  const body = hasGigs ? (
    <ul className="gigs__list">
      {gigs.map((gig, index) => (
        <GigRow key={gig.id} gig={gig} soft={soft} index={index} />
      ))}
    </ul>
  ) : soft ? (
    <p className="gigs__empty">No gigs listed yet — check back soon.</p>
  ) : (
    <motion.p
      className="gigs__empty"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.32 }}
    >
      No gigs listed yet — check back soon.
    </motion.p>
  )

  if (soft) {
    return (
      <section className="gigs" id="gigs">
        <div className="gigs__mark" aria-hidden="true">
          <BrandMark variant="star" className="gigs__star" />
        </div>
        <div className="gigs__header">
          <GigsHeader soft />
        </div>
        {body}
      </section>
    )
  }

  return (
    <section className="gigs" id="gigs">
      <motion.div
        className="gigs__mark"
        aria-hidden="true"
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={viewport}
        transition={{ duration: 1.05, ease: easeOut }}
      >
        <BrandMark variant="star" className="gigs__star" />
      </motion.div>

      <div className="gigs__header">
        <GigsHeader soft={false} />
      </div>

      {body}
    </section>
  )
}

export function Gigs() {
  const { soft } = useMotionProfile()
  return <GigsContent soft={soft} />
}
