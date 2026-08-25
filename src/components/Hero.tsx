import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { contact, hero } from '../data/contact'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import './Hero.css'

const heroSources = [hero.videoSrc, hero.fallbackSrc] as const

function useHeroVideo(lite: boolean) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const play = async () => {
      try {
        video.muted = true
        await video.play()
      } catch {
        // Autoplay blocked
      }
    }

    void play()
  }, [showVideo, sourceIndex])

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || !showVideo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
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

  return {
    sectionRef,
    videoRef,
    sourceIndex,
    showVideo,
    videoReady,
    setVideoReady,
    lite,
    onVideoError,
  }
}

function HeroMedia({
  videoRef,
  sourceIndex,
  showVideo,
  lite,
  onVideoError,
  setVideoReady,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  sourceIndex: number
  showVideo: boolean
  lite: boolean
  onVideoError: () => void
  setVideoReady: (ready: boolean) => void
}) {
  return (
    <>
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
          preload={lite ? 'metadata' : 'auto'}
          onLoadedData={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          onError={onVideoError}
        />
      )}
      <div className="hero__scrim" />
      <div className="hero__grain" />
    </>
  )
}

function HeroStatic() {
  const reduceMotion = useReducedMotion()
  const { lite, safariIOS } = useMotionProfile()
  const {
    sectionRef,
    videoRef,
    sourceIndex,
    showVideo,
    videoReady,
    setVideoReady,
    onVideoError,
  } = useHeroVideo(lite)

  // Only Safari needs scroll-pause; Chrome on iOS is already smooth
  useEffect(() => {
    if (!safariIOS) return
    const video = videoRef.current
    if (!video || !showVideo) return

    let resumeTimer: number | undefined
    const pauseForScroll = () => {
      video.pause()
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(() => {
        const section = sectionRef.current
        if (!section) return
        const rect = section.getBoundingClientRect()
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
        if (onScreen) void video.play().catch(() => undefined)
      }, 160)
    }

    window.addEventListener('scroll', pauseForScroll, { passive: true })
    window.addEventListener('touchmove', pauseForScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', pauseForScroll)
      window.removeEventListener('touchmove', pauseForScroll)
      window.clearTimeout(resumeTimer)
    }
  }, [safariIOS, showVideo, sourceIndex, videoRef, sectionRef])

  return (
    <section
      className="hero hero--lite"
      id="top"
      aria-label="KHWEZI K — Amapiano and Afro House DJ"
      ref={sectionRef}
    >
      <div
        className={`hero__loader ${videoReady || !showVideo ? 'is-done' : ''}`}
        aria-hidden="true"
      >
        <img src="/brand/monogram-cocoa.png" alt="" width={64} height={64} />
      </div>

      <div className="hero__media" aria-hidden="true">
        <HeroMedia
          videoRef={videoRef}
          sourceIndex={sourceIndex}
          showVideo={showVideo}
          lite={lite}
          onVideoError={onVideoError}
          setVideoReady={setVideoReady}
        />
      </div>

      <div className="hero__content">
        <motion.p
          className="hero__label"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          Amapiano & Afro House DJ
        </motion.p>
        <motion.h1
          className="hero__brand"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <BrandMark className="hero__lockup" alt="" />
          <span className="sr-only">
            KHWEZI K — Amapiano and Afro House DJ for bookings
          </span>
        </motion.h1>
        <motion.p
          className="hero__tagline"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
        >
          {contact.tagline}
        </motion.p>
        <div className="hero__ctas">
          <a className="btn btn--clay" href="#sets">
            Watch sets
          </a>
          <a className="btn btn--ghost" href="#contact">
            Contact
          </a>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about">
        <span />
      </a>
    </section>
  )
}

function HeroMotion() {
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
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const mediaBright = useTransform(scrollYProgress, [0.35, 0.9], [1, 0.55])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -48])
  const veilOpacity = useTransform(scrollYProgress, [0.4, 0.95], [0, 1])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return
    void video.play().catch(() => undefined)
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
    <section
      className="hero"
      id="top"
      aria-label="KHWEZI K — Amapiano and Afro House DJ"
      ref={sectionRef}
    >
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
          opacity: mediaBright,
        }}
      >
        <HeroMedia
          videoRef={videoRef}
          sourceIndex={sourceIndex}
          showVideo={showVideo}
          lite={false}
          onVideoError={onVideoError}
          setVideoReady={setVideoReady}
        />
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

export function Hero() {
  const { soft } = useMotionProfile()
  return soft ? <HeroStatic /> : <HeroMotion />
}
