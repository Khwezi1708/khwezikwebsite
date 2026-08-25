import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { bio } from '../data/bio'
import './About.css'

type Tone = 'honey' | 'rosewood'

type Paragraph = {
  text: string
  highlights?: readonly { phrase: string; tone: Tone }[]
}

const easeOut = [0.22, 1, 0.36, 1] as const

function highlightText(
  text: string,
  highlights: readonly { phrase: string; tone: Tone }[] = [],
): ReactNode[] {
  if (!highlights.length) return [text]

  const nodes: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let earliest = -1
    let match: { phrase: string; tone: Tone } | null = null

    for (const h of highlights) {
      const idx = remaining.indexOf(h.phrase)
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx
        match = h
      }
    }

    if (!match || earliest === -1) {
      nodes.push(<span key={key++}>{remaining}</span>)
      break
    }

    if (earliest > 0) {
      nodes.push(<span key={key++}>{remaining.slice(0, earliest)}</span>)
    }

    nodes.push(
      <mark key={key++} className={`mark mark--${match.tone}`}>
        {match.phrase}
      </mark>,
    )
    remaining = remaining.slice(earliest + match.phrase.length)
  }

  return nodes
}

function ParagraphList({
  paragraphs,
  className = 'about__body',
  stagger = 0.06,
  baseDelay = 0,
}: {
  paragraphs: readonly Paragraph[]
  className?: string
  stagger?: number
  baseDelay?: number
}) {
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={paragraph.text.slice(0, 48)}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{
            duration: 0.7,
            ease: easeOut,
            delay: baseDelay + Math.min(index * stagger, 0.28),
          }}
        >
          {highlightText(paragraph.text, paragraph.highlights ?? [])}
        </motion.p>
      ))}
    </div>
  )
}

function AboutImage({
  src,
  alt,
  className,
  direction = 'left',
}: {
  src: string
  alt: string
  className: string
  direction?: 'left' | 'right'
}) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [28, -28],
  )

  const fromX = direction === 'left' ? -36 : 36

  return (
    <motion.figure
      ref={ref}
      className={className}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, x: fromX, clipPath: 'inset(8% 8% 8% 8%)' }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' }
      }
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 1.05, ease: easeOut }}
    >
      <motion.img src={src} alt={alt} style={{ y }} />
    </motion.figure>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.15'],
  })

  const titleScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 0.88],
  )

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__intro">
        <div className="about__copy">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            01 · About
          </motion.p>

          <motion.h2
            className="about__headline"
            style={{ scale: titleScale }}
          >
            <span>{bio.headlineLine1}</span>
            <span>{bio.headlineLine2}</span>
          </motion.h2>

          <motion.blockquote
            className="about__quote"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
          >
            “{bio.pullQuote}”
          </motion.blockquote>

          <ParagraphList paragraphs={bio.intro} />
        </div>

        <AboutImage
          className="about__visual"
          src="/images/about-nova.jpg"
          alt="KHWEZI K, Amapiano and Afro House DJ"
          direction="right"
        />
      </div>

      <div className="about__feature">
        <AboutImage
          className="about__feature-visual"
          src="/images/about-club.jpg"
          alt="KHWEZI K performing a live Afro electronic DJ set"
          direction="left"
        />

        <div className="about__feature-copy">
          <motion.h3
            className="about__feature-title"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 28, filter: 'blur(6px)' }
            }
            whileInView={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
            }
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.12 }}
          >
            {bio.featureHeadline}
          </motion.h3>
          <ParagraphList
            paragraphs={bio.feature}
            className="about__body"
            baseDelay={0.22}
            stagger={0.1}
          />
        </div>
      </div>
    </section>
  )
}
