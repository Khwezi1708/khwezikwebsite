import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { contact, hero } from '../data/contact'
import { BrandMark } from './BrandMark'
import './Hero.css'

const heroSources = [hero.videoSrc, hero.fallbackSrc] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [sourceIndex, setSourceIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '18%'],
  )
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.12],
  )
  const mediaBlur = useTransform(
    scrollYProgress,
    [0.35, 0.85],
    reduceMotion ? ['blur(0px)', 'blur(0px)'] : ['blur(0px)', 'blur(18px)'],
  )
  const mediaBright = useTransform(
    scrollYProgress,
    [0.35, 0.9],
    reduceMotion ? [1, 1] : [1, 0.55],
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduceMotion ? [1, 1] : [1, 0],
  )
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduceMotion ? [0, 0] : [0, -48],
  )
  const veilOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.95],
    reduceMotion ? [0, 0] : [0, 1],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const play = async () => {
      try {
        video.muted = true
        await video.play()
      } catch {
        // Autoplay blocked — still keep the element; user gesture may start it
      }
    }

    void play()
  }, [showVideo, sourceIndex])

  const onVideoError = () => {
    if (sourceIndex < heroSources.length - 1) {
      setVideoReady(false)
      setSourceIndex((current) => current + 1)
      return
    }
    setShowVideo(false)
    setVideoReady(true)
  }

  return (
    <section className="hero" id="top" aria-label="KHWEZI K — Amapiano and Afro House DJ" ref={sectionRef}>
      <div
        className={`hero__loader ${videoReady || !showVideo ? 'is-done' : ''}`}
        aria-hidden="true"
      >
        <img src="/brand/monogram-cocoa.png" alt="" width={64} height={64} />
      </div>

      <motion.div
        className="hero__media"
        aria-hidden="true"
        style={{
          y: mediaY,
          scale: mediaScale,
          filter: mediaBlur,
          opacity: mediaBright,
        }}
      >
        {showVideo && (
          <video
            key={heroSources[sourceIndex]}
            ref={videoRef}
            className="hero__video"
            src={heroSources[sourceIndex]}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onError={onVideoError}
          />
        )}
        <div className="hero__scrim" />
        <div className="hero__grain" />
      </motion.div>

      <motion.div
        className="hero__veil"
        aria-hidden="true"
        style={{ opacity: veilOpacity }}
      />

      <motion.div
        className="hero__content"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.p
          className="hero__label"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          Amapiano & Afro House DJ
        </motion.p>
        <motion.h1
          className="hero__brand"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
        >
          <BrandMark className="hero__lockup" alt="" />
          <span className="sr-only">
            KHWEZI K — Amapiano and Afro House DJ for bookings
          </span>
        </motion.h1>
        <motion.p
          className="hero__tagline"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        >
          {contact.tagline}
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.58 }}
        >
          <a className="btn btn--clay" href="#sets">
            Watch sets
          </a>
          <a className="btn btn--ghost" href="#contact">
            Contact
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        className="hero__scroll"
        href="#about"
        aria-label="Scroll to about"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span />
      </motion.a>
    </section>
  )
}
