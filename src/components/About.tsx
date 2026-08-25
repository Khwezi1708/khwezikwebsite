import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { bio } from '../data/bio'
import { useMotionProfile } from '../hooks/useMotionProfile'
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
  soft,
}: {
  paragraphs: readonly Paragraph[]
  className?: string
  stagger?: number
  baseDelay?: number
  soft: boolean
}) {
  if (soft) {
    return (
      <div className={className}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.text.slice(0, 48)}>
            {highlightText(paragraph.text, paragraph.highlights ?? [])}
          </p>
        ))}
      </div>
    )
  }

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

function AboutImageStatic({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  return (
    <figure className={className}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </figure>
  )
}

function AboutImageMotion({
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [28, -28])
  const fromX = direction === 'left' ? -36 : 36

  return (
    <motion.figure
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 1.05, ease: easeOut }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        loading="lazy"
        decoding="async"
      />
    </motion.figure>
  )
}

function AboutStatic() {
  return (
    <section className="about" id="about">
      <div className="about__intro">
        <div className="about__copy">
          <p className="section-label">01 · About</p>
          <h2 className="about__headline">
            <span>{bio.headlineLine1}</span>
            <span>{bio.headlineLine2}</span>
          </h2>
          <blockquote className="about__quote">“{bio.pullQuote}”</blockquote>
          <ParagraphList paragraphs={bio.intro} soft />
        </div>
        <AboutImageStatic
          className="about__visual"
          src="/images/about-nova.jpg"
          alt="KHWEZI K, Amapiano and Afro House DJ"
        />
      </div>

      <div className="about__feature">
        <AboutImageStatic
          className="about__feature-visual"
          src="/images/about-club.jpg"
          alt="KHWEZI K performing a live Afro electronic DJ set"
        />
        <div className="about__feature-copy">
          <h3 className="about__feature-title">
            <span>{bio.featureHeadlineLine1}</span>
            <span>{bio.featureHeadlineLine2}</span>
          </h3>
          <ParagraphList
            paragraphs={bio.feature}
            className="about__body"
            soft
          />
        </div>
      </div>
    </section>
  )
}

function AboutMotion() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.15'],
  })
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.88])

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

          <ParagraphList paragraphs={bio.intro} soft={false} />
        </div>

        <AboutImageMotion
          className="about__visual"
          src="/images/about-nova.jpg"
          alt="KHWEZI K, Amapiano and Afro House DJ"
          direction="right"
        />
      </div>

      <div className="about__feature">
        <AboutImageMotion
          className="about__feature-visual"
          src="/images/about-club.jpg"
          alt="KHWEZI K performing a live Afro electronic DJ set"
          direction="left"
        />

        <div className="about__feature-copy">
          <motion.h3
            className="about__feature-title"
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.85, ease: easeOut, delay: 0.12 }}
          >
            <span>{bio.featureHeadlineLine1}</span>
            <span>{bio.featureHeadlineLine2}</span>
          </motion.h3>
          <ParagraphList
            paragraphs={bio.feature}
            className="about__body"
            baseDelay={0.22}
            stagger={0.1}
            soft={false}
          />
        </div>
      </div>
    </section>
  )
}

export function About() {
  const { soft } = useMotionProfile()
  return soft ? <AboutStatic /> : <AboutMotion />
}
