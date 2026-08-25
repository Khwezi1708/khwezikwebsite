import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { collabLooks } from '../data/collabs'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import './Collabs.css'

const easeOut = [0.22, 1, 0.36, 1] as const

function CollabsLightbox({
  lightbox,
  soft,
  onClose,
}: {
  lightbox: { src: string; alt: string } | null
  soft: boolean
  onClose: () => void
}) {
  if (!lightbox) return null

  if (soft) {
    return (
      <div
        className="collab__lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        onClick={onClose}
      >
        <button
          type="button"
          className="collab__lightbox-close"
          onClick={onClose}
          aria-label="Close image"
        >
          Close
        </button>
        <img
          src={lightbox.src}
          alt={lightbox.alt}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="collab__lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <button
          type="button"
          className="collab__lightbox-close"
          onClick={onClose}
          aria-label="Close image"
        >
          Close
        </button>
        <motion.img
          src={lightbox.src}
          alt={lightbox.alt}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: easeOut }}
          onClick={(event) => event.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  )
}

function CollabsStatic({
  lightbox,
  setLightbox,
}: {
  lightbox: { src: string; alt: string } | null
  setLightbox: (value: { src: string; alt: string } | null) => void
}) {
  return (
    <section className="collabs" id="collabs">
      <div className="collabs__mark" aria-hidden="true">
        <BrandMark variant="star" className="collabs__star" />
      </div>

      {collabLooks.map((look, lookIndex) => (
        <article key={look.id} className="collab">
          <div className="collab__copy">
            {lookIndex === 0 && (
              <p className="section-label">04 · Collabs</p>
            )}
            <h2 className="collab__title">{look.partners}</h2>
            <p className="collab__lead">{look.lead}</p>
            <p className="collab__body">{look.body}</p>
            <ul className="collab__credits">
              {look.credits.map((credit) => (
                <li key={credit.role}>
                  <span className="collab__credit-role">{credit.role}</span>
                  <span className="collab__credit-name">{credit.name}</span>
                  {credit.handle ? (
                    <span className="collab__credit-handle">{credit.handle}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <ul className="collab__gallery">
            {look.images.map((src, index) => {
              const alt = `${look.partners} (${index + 1})`
              return (
                <li key={src} className="collab__shot">
                  <button
                    type="button"
                    className="collab__shot-btn"
                    onClick={() => setLightbox({ src, alt })}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <img src={src} alt={alt} loading="lazy" decoding="async" />
                  </button>
                </li>
              )
            })}
          </ul>
        </article>
      ))}

      <CollabsLightbox
        lightbox={lightbox}
        soft
        onClose={() => setLightbox(null)}
      />
    </section>
  )
}

function CollabsMotion({
  lightbox,
  setLightbox,
  viewport,
}: {
  lightbox: { src: string; alt: string } | null
  setLightbox: (value: { src: string; alt: string } | null) => void
  viewport: ReturnType<typeof useMotionProfile>['viewport']
}) {
  return (
    <section className="collabs" id="collabs">
      <motion.div
        className="collabs__mark"
        aria-hidden="true"
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={viewport}
        transition={{ duration: 1.05, ease: easeOut }}
      >
        <BrandMark variant="star" className="collabs__star" />
      </motion.div>

      {collabLooks.map((look, lookIndex) => (
        <article key={look.id} className="collab">
          <div className="collab__copy">
            {lookIndex === 0 && (
              <motion.p
                className="section-label"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.55, ease: easeOut }}
              >
                04 · Collabs
              </motion.p>
            )}
            <motion.h2
              className="collab__title"
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={viewport}
              transition={{ duration: 0.85, ease: easeOut, delay: 0.08 }}
            >
              {look.partners}
            </motion.h2>
            <motion.p
              className="collab__lead"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.16 }}
            >
              {look.lead}
            </motion.p>
            <motion.p
              className="collab__body"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.24 }}
            >
              {look.body}
            </motion.p>
            <motion.ul
              className="collab__credits"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.3 }}
            >
              {look.credits.map((credit) => (
                <li key={credit.role}>
                  <span className="collab__credit-role">{credit.role}</span>
                  <span className="collab__credit-name">{credit.name}</span>
                  {credit.handle ? (
                    <span className="collab__credit-handle">{credit.handle}</span>
                  ) : null}
                </li>
              ))}
            </motion.ul>
          </div>

          <ul className="collab__gallery">
            {look.images.map((src, index) => {
              const alt = `${look.partners} (${index + 1})`
              return (
                <motion.li
                  key={src}
                  className="collab__shot"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{
                    duration: 0.75,
                    ease: easeOut,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                >
                  <button
                    type="button"
                    className="collab__shot-btn"
                    onClick={() => setLightbox({ src, alt })}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <img src={src} alt={alt} loading="lazy" />
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </article>
      ))}

      <CollabsLightbox
        lightbox={lightbox}
        soft={false}
        onClose={() => setLightbox(null)}
      />
    </section>
  )
}

export function Collabs() {
  const { soft, viewport } = useMotionProfile()
  const [lightbox, setLightbox] = useState<{
    src: string
    alt: string
  } | null>(null)

  useEffect(() => {
    if (!lightbox) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightbox])

  return soft ? (
    <CollabsStatic lightbox={lightbox} setLightbox={setLightbox} />
  ) : (
    <CollabsMotion
      lightbox={lightbox}
      setLightbox={setLightbox}
      viewport={viewport}
    />
  )
}
