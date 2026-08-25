import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import './Nav.css'

const links = [
  { href: '#about', label: 'About' },
  { href: '#sets', label: 'Sets' },
  { href: '#gigs', label: 'Gigs' },
  { href: '#collabs', label: 'Collabs' },
  { href: '#contact', label: 'Contact' },
  { href: '#press', label: 'Press' },
  { href: '#socials', label: 'Socials' },
] as const

const easeOut = [0.22, 1, 0.36, 1] as const

function usePastHero() {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry?.isIntersecting)
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return pastHero
}

export function Nav() {
  const { soft } = useMotionProfile()
  const pastHero = usePastHero()
  const solid = pastHero ? ' nav--solid' : ''

  if (soft) {
    return (
      <header className={`nav${solid}`}>
        <a href="#top" className="nav__brand" aria-label="KHWEZI K home">
          <BrandMark className="nav__lockup" />
          <BrandMark variant="monogram" className="nav__mono" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>
    )
  }

  return (
    <motion.header
      className={`nav${solid}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
    >
      <motion.a
        href="#top"
        className="nav__brand"
        aria-label="KHWEZI K home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut, delay: 0.35 }}
      >
        <BrandMark className="nav__lockup" />
        <BrandMark variant="monogram" className="nav__mono" />
      </motion.a>

      <nav className="nav__links" aria-label="Primary">
        {links.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: easeOut,
              delay: 0.4 + index * 0.05,
            }}
          >
            {link.label}
          </motion.a>
        ))}
      </nav>
    </motion.header>
  )
}
