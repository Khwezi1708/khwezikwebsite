import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { contact, socials } from '../data/contact'
import { useMotionProfile } from '../hooks/useMotionProfile'
import { BrandMark } from './BrandMark'
import { Press } from './Press'
import './Book.css'

type Topic = 'bookings' | 'press' | 'collaborations' | 'other'

type FormState = {
  name: string
  email: string
  topic: Topic
  message: string
  website: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const topics: { value: Topic; label: string }[] = [
  { value: 'bookings', label: 'Bookings' },
  { value: 'press', label: 'Press' },
  { value: 'collaborations', label: 'Collaborations' },
  { value: 'other', label: 'Other' },
]

const topicSubject = (topic: Topic) => {
  switch (topic) {
    case 'bookings':
      return 'Bookings'
    case 'press':
      return 'Press'
    case 'collaborations':
      return 'Collaborations'
    case 'other':
      return 'Other'
    default: {
      const _exhaustive: never = topic
      return _exhaustive
    }
  }
}

const initialForm: FormState = {
  name: '',
  email: '',
  topic: 'bookings',
  message: '',
  website: '',
}

const easeOut = [0.22, 1, 0.36, 1] as const

export function Book() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const reduceMotion = useReducedMotion()
  const { soft, viewport } = useMotionProfile()
  const enter = <T,>(hidden: T) => (soft ? false : hidden)
  const reveal = <T,>(shown: T) => (soft ? undefined : shown)


  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    if (form.website.trim()) return

    setStatus('submitting')

    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Name: form.name.trim(),
          Email: form.email.trim(),
          Topic: topicSubject(form.topic),
          Message: form.message.trim(),
          _replyto: form.email.trim(),
          _subject: `[KHWEZI K · ${topicSubject(form.topic)}] ${form.name.trim() || 'Website'}`,
          _template: 'basic',
          _captcha: 'false',
        }),
      })

      const payload = (await response.json().catch(() => null)) as {
        success?: string | boolean
        message?: string
      } | null

      const ok =
        response.ok &&
        (payload?.success === true || payload?.success === 'true')

      if (!ok) throw new Error(payload?.message ?? 'Send failed')

      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="book">
      <motion.div
        className="book__panel"
        id="contact"
        initial={enter({ opacity: 0, y: 40 })}
        whileInView={reveal({ opacity: 1, y: 0 })}
        viewport={viewport}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <motion.p
          className="section-label"
          initial={enter({ opacity: 0, y: 14 })}
          whileInView={reveal({ opacity: 1, y: 0 })}
          viewport={viewport}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.05 }}
        >
          04 · Bookings
        </motion.p>
        <motion.h2
          className="book__title"
          initial={enter({ opacity: 0, y: 18 })}
          whileInView={reveal({ opacity: 1, y: 0 })}
          viewport={viewport}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.1 }}
        >
          Contact us
        </motion.h2>
        <motion.p
          className="book__lede"
          initial={enter({ opacity: 0, y: 14 })}
          whileInView={reveal({ opacity: 1, y: 0 })}
          viewport={viewport}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.16 }}
        >
          For bookings, press and collaborations.
        </motion.p>

        <div className="book__sheet">
          <motion.div
            className="book__aside"
            initial={enter({ opacity: 0, x: -16 })}
            whileInView={reveal({ opacity: 1, x: 0 })}
            viewport={viewport}
            transition={{ duration: soft ? 0.45 : 0.7, ease: easeOut, delay: soft ? 0.05 : 0.2 }}
          >
            <p className="book__aside-label">Email</p>
            <a className="book__aside-mail" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </motion.div>

          <form className="book__form" onSubmit={onSubmit}>
            <input
              className="book__honey"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  website: event.target.value,
                }))
              }
              aria-hidden="true"
            />

            <motion.label
              className="book__field"
              initial={enter({ opacity: 0, y: 16 })}
              whileInView={reveal({ opacity: 1, y: 0 })}
              viewport={viewport}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.22 }}
            >
              <span>Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </motion.label>

            <motion.label
              className="book__field"
              initial={enter({ opacity: 0, y: 16 })}
              whileInView={reveal({ opacity: 1, y: 0 })}
              viewport={viewport}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.28 }}
            >
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </motion.label>

            <motion.label
              className="book__field book__field--topic"
              initial={enter({ opacity: 0, y: 16 })}
              whileInView={reveal({ opacity: 1, y: 0 })}
              viewport={viewport}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.31 }}
            >
              <span>Topic</span>
              <select
                name="topic"
                required
                value={form.topic}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    topic: event.target.value as Topic,
                  }))
                }
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </motion.label>

            <motion.label
              className="book__field book__field--message"
              initial={enter({ opacity: 0, y: 16 })}
              whileInView={reveal({ opacity: 1, y: 0 })}
              viewport={viewport}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.34 }}
            >
              <span>Message</span>
              <textarea
                name="message"
                rows={2}
                required
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
            </motion.label>

            <motion.button
              type="submit"
              className="book__submit"
              disabled={status === 'submitting'}
              initial={enter({ opacity: 0, y: 12 })}
              whileInView={reveal({ opacity: 1, y: 0 })}
              viewport={viewport}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.4 }}
            >
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </motion.button>

            {status === 'success' && (
              <p className="book__form-note" role="status">
                Message sent to {contact.email}.
              </p>
            )}
            {status === 'error' && (
              <p className="book__form-note book__form-note--error" role="alert">
                Couldn’t send. Email {contact.email} directly, or try again.
              </p>
            )}
          </form>
        </div>
      </motion.div>

      <Press />

      <footer className="footer" id="socials">
        <motion.div
          className="footer__socials"
          initial={enter({ opacity: 0, y: 24 })}
          whileInView={reveal({ opacity: 1, y: 0 })}
          viewport={viewport}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="section-label">06 · Socials</p>
          <h2 className="section-title footer__title">Stay connected.</h2>
          <nav aria-label="Socials">
            <ul>
              {socials.map((social, index) => (
                <motion.li
                  key={social.id}
                  initial={enter({ opacity: 0, y: 14 })}
                  whileInView={reveal({ opacity: 1, y: 0 })}
                  viewport={viewport}
                  transition={{
                    duration: 0.5,
                    ease: easeOut,
                    delay: 0.08 + index * 0.06,
                  }}
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>
        </motion.div>

        <motion.div
          className="footer__bottom"
          initial={{ opacity: 0 }}
          whileInView={reveal({ opacity: 1 })}
          viewport={viewport}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
        >
          <p className="footer__meta">
            © {new Date().getFullYear()} KHWEZI K · Afro electronic music ·{' '}
            {contact.genres}
          </p>
          <motion.div
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.85, rotate: -8 }
            }
            whileInView={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, rotate: 0 }
            }
            viewport={viewport}
            transition={{ duration: 0.75, ease: easeOut, delay: 0.28 }}
          >
            <BrandMark variant="star" className="footer__star" />
          </motion.div>
        </motion.div>
      </footer>
    </section>
  )
}
