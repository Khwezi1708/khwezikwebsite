import { AnimatePresence, motion } from 'framer-motion'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react'
import { mixcloudEmbed, soundcloudEmbed } from '../data/contact'
import { genres, type GenreKey } from '../data/sets'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import './Sets.css'

const PREVIEW_COUNT = 3
const MIXCLOUD_API_SRC = 'https://widget.mixcloud.com/media/js/widgetApi.js'
const MIXCLOUD_API_ID = 'mixcloud-widget-api'

function loadMixcloudApi(): Promise<MixcloudApi> {
  if (window.Mixcloud?.PlayerWidget) {
    return Promise.resolve(window.Mixcloud)
  }

  const existing = document.getElementById(MIXCLOUD_API_ID)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => {
        if (window.Mixcloud) resolve(window.Mixcloud)
        else reject(new Error('Mixcloud API missing'))
      })
      existing.addEventListener('error', () =>
        reject(new Error('Mixcloud API failed')),
      )
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = MIXCLOUD_API_ID
    script.src = MIXCLOUD_API_SRC
    script.async = true
    script.onload = () => {
      if (window.Mixcloud) resolve(window.Mixcloud)
      else reject(new Error('Mixcloud API missing'))
    }
    script.onerror = () => reject(new Error('Mixcloud API failed'))
    document.body.appendChild(script)
  })
}

function MixcloudPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    let cancelled = false
    let playListener: (() => void) | null = null
    let widget: MixcloudWidget | null = null

    const armSeek = async () => {
      try {
        const api = await loadMixcloudApi()
        if (cancelled || !iframeRef.current) return

        widget = api.PlayerWidget(iframeRef.current)
        await widget.ready
        if (cancelled) return

        const jumpToGuest = async () => {
          const position = await widget?.getPosition()
          // Only jump if still near the start of the show
          if (position !== undefined && position < 45) {
            await widget?.seek(mixcloudEmbed.startSeconds)
          }
        }

        playListener = () => {
          void jumpToGuest()
        }
        widget.events.play.on(playListener)
        await jumpToGuest()
      } catch {
        // Embed still works; start_time query remains as best effort
      }
    }

    void armSeek()

    return () => {
      cancelled = true
      if (widget && playListener) widget.events.play.off(playListener)
    }
  }, [])

  return (
    <div className="sets__mc-frame">
      <iframe
        ref={iframeRef}
        title={mixcloudEmbed.title}
        allow="autoplay; encrypted-media; fullscreen"
        src={mixcloudEmbed.playerSrc}
      />
    </div>
  )
}

const thumbSources = (id: string) =>
  [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  ] as const

function YouTubeThumb({ id }: { id: string }) {
  const sources = thumbSources(id)
  const [sourceIndex, setSourceIndex] = useState(0)

  const advance = () => {
    setSourceIndex((current) =>
      current < sources.length - 1 ? current + 1 : current,
    )
  }

  const onLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    // YouTube sometimes returns a 120×90 gray placeholder for missing maxres
    if (event.currentTarget.naturalWidth < 200) advance()
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt=""
      loading="lazy"
      onLoad={onLoad}
      onError={advance}
    />
  )
}

export function Sets() {
  const [active, setActive] = useState<GenreKey>('amapiano')
  const { soft, viewport } = useMotionProfile()
  const [expanded, setExpanded] = useState(false)

  const playlist = useMemo(
    () => genres.find((g) => g.key === active) ?? genres[0],
    [active],
  )

  useEffect(() => {
    setExpanded(false)
  }, [active])

  const visibleSets = expanded
    ? playlist.sets
    : playlist.sets.slice(0, PREVIEW_COUNT)
  const hasMore = playlist.sets.length > PREVIEW_COUNT

  const genreSwitch = (
    <div className="sets__switch" role="tablist" aria-label="Genre">
      {genres.map((genre) => {
        const isActive = genre.key === active
        return (
          <button
            key={genre.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`sets__tab sets__tab--${genre.key} ${isActive ? 'is-active' : ''}`}
            onClick={() => setActive(genre.key)}
          >
            {isActive &&
              (soft ? (
                <span className={`sets__tab-bg sets__tab-bg--${genre.key}`} />
              ) : (
                <motion.span
                  className={`sets__tab-bg sets__tab-bg--${genre.key}`}
                  layoutId="genre-tab"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              ))}
            <span className="sets__tab-label">{genre.label}</span>
            <span className="sets__tab-count">{genre.sets.length}</span>
          </button>
        )
      })}
    </div>
  )

  const moreBlock = hasMore ? (
    <div className="sets__more">
      <button
        type="button"
        className="sets__more-btn"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded
          ? 'Show less'
          : `See more (${playlist.sets.length - PREVIEW_COUNT})`}
      </button>
      <a
        className="sets__channel"
        href={playlist.playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Full playlist on YouTube →
      </a>
    </div>
  ) : null

  if (soft) {
    return (
      <section className="sets" id="sets">
        <div className="sets__mark" aria-hidden="true">
          <BrandMark variant="star" className="sets__star" />
        </div>

        <div className="sets__header">
          <div className="sets__copy">
            <p className="section-label">02 · Sets</p>
            <h2 className="section-title">Listen. Groove. Vibe.</h2>
            <p className="sets__intro">
              Afro electronic selections — Amapiano and Afro House, including
              guest sets on other channels.
            </p>
          </div>
        </div>

        {genreSwitch}

        <div className="sets__panel" role="tabpanel">
          <div className="sets__panel-head">
            <p className="sets__tagline">{playlist.tagline}</p>
          </div>

          <ul className="sets__list">
            {visibleSets.map((set) => (
              <li key={set.id} className="set">
                <div className="set__meta">
                  <p className="set__label">{set.channel}</p>
                  <h3 className="set__title">{set.title}</h3>
                  <p className="set__duration">{set.subtitle}</p>
                </div>
                <a
                  className="set__thumb"
                  href={`https://www.youtube.com/watch?v=${set.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${set.title} on YouTube`}
                >
                  <YouTubeThumb id={set.id} />
                  <span className="set__play" aria-hidden="true" />
                  <span className="set__watch">Watch on YouTube</span>
                </a>
              </li>
            ))}
          </ul>

          {moreBlock}
        </div>

        <div className="sets__soundcloud">
          <div className="sets__panel-head">
            <p className="sets__tagline">SoundCloud</p>
            <a
              className="sets__channel"
              href={soundcloudEmbed.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open profile →
            </a>
          </div>
          <p className="sets__embed-fallback">
            <a
              href={soundcloudEmbed.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on SoundCloud →
            </a>
          </p>
        </div>

        <div className="sets__mixcloud">
          <div className="sets__panel-head">
            <div>
              <p className="sets__tagline">EXT Radio · Guest mix</p>
              <p className="sets__mixcloud-note">{mixcloudEmbed.note}</p>
            </div>
            <a
              className="sets__channel"
              href={`${mixcloudEmbed.showUrl}?start=${mixcloudEmbed.startSeconds}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open show →
            </a>
          </div>
          <p className="sets__embed-fallback">
            <a
              href={`${mixcloudEmbed.showUrl}?start=${mixcloudEmbed.startSeconds}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on Mixcloud →
            </a>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="sets" id="sets">
      <motion.div
        className="sets__mark"
        aria-hidden="true"
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={viewport}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <BrandMark variant="star" className="sets__star" />
      </motion.div>

      <div className="sets__header">
        <motion.div
          className="sets__copy"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">02 · Sets</p>
          <h2 className="section-title">Listen. Groove. Vibe.</h2>
          <p className="sets__intro">
            Afro electronic selections — Amapiano and Afro House, including
            guest sets on other channels.
          </p>
        </motion.div>
      </div>

      {genreSwitch}

      <AnimatePresence mode="wait">
        <motion.div
          key={playlist.key}
          className="sets__panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sets__panel-head">
            <p className="sets__tagline">{playlist.tagline}</p>
          </div>

          <ul className="sets__list">
            {visibleSets.map((set, index) => (
              <motion.li
                key={set.id}
                className="set"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(index * 0.06, 0.3),
                }}
              >
                <div className="set__meta">
                  <p className="set__label">{set.channel}</p>
                  <h3 className="set__title">{set.title}</h3>
                  <p className="set__duration">{set.subtitle}</p>
                </div>
                <motion.a
                  className="set__thumb"
                  href={`https://www.youtube.com/watch?v=${set.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${set.title} on YouTube`}
                  initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }}
                  whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                  viewport={viewport}
                  transition={{
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: Math.min(0.1 + index * 0.05, 0.35),
                  }}
                >
                  <YouTubeThumb id={set.id} />
                  <span className="set__play" aria-hidden="true" />
                  <span className="set__watch">Watch on YouTube</span>
                </motion.a>
              </motion.li>
            ))}
          </ul>

          {moreBlock}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="sets__soundcloud"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="sets__panel-head">
          <p className="sets__tagline">SoundCloud</p>
          <a
            className="sets__channel"
            href={soundcloudEmbed.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open profile →
          </a>
        </div>
        <div className="sets__sc-frame">
          <iframe
            title="KHWEZI K on SoundCloud"
            allow="autoplay"
            loading="lazy"
            src={soundcloudEmbed.playerSrc}
          />
        </div>
      </motion.div>

      <motion.div
        className="sets__mixcloud"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="sets__panel-head">
          <div>
            <p className="sets__tagline">EXT Radio · Guest mix</p>
            <p className="sets__mixcloud-note">{mixcloudEmbed.note}</p>
          </div>
          <a
            className="sets__channel"
            href={`${mixcloudEmbed.showUrl}?start=${mixcloudEmbed.startSeconds}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open show →
          </a>
        </div>
        <MixcloudPlayer />
      </motion.div>
    </section>
  )
}
