import { AnimatePresence, motion } from 'framer-motion'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react'
import { pressPack } from '../data/contact'
import { useMotionProfile } from '../hooks/useMotionProfile'
import './Press.css'

const easeOut = [0.22, 1, 0.36, 1] as const

function PressModal({
  open,
  soft,
  titleId,
  errorId,
  password,
  error,
  inputRef,
  onClose,
  onSubmit,
  setPassword,
  setError,
}: {
  open: boolean
  soft: boolean
  titleId: string
  errorId: string
  password: string
  error: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onClose: () => void
  onSubmit: (event: FormEvent) => void
  setPassword: (value: string) => void
  setError: (value: boolean) => void
}) {
  if (!open) return null

  const fields = (
    <>
      <button
        type="button"
        className="press__modal-close"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>

      <p className="press__modal-label">Press pack</p>
      <h3 className="press__modal-title" id={titleId}>
        Enter password
      </h3>
      <p className="press__modal-copy">
        Access is reserved for promoters, press and collaborators.
      </p>

      <label className="press__modal-field">
        <span className="sr-only">Password</span>
        <input
          ref={inputRef}
          type="password"
          name="press-password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setPassword(event.target.value)
            if (error) setError(false)
          }}
        />
      </label>

      {error && (
        <p className="press__modal-error" id={errorId} role="alert">
          Incorrect password. Try again.
        </p>
      )}

      <button type="submit" className="press__modal-submit">
        Unlock press pack
      </button>
    </>
  )

  if (soft) {
    return (
      <div
        className="press__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={onClose}
      >
        <form
          className="press__modal-card"
          onClick={(event) => event.stopPropagation()}
          onSubmit={onSubmit}
        >
          {fields}
        </form>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="press__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.form
          className="press__modal-card"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: easeOut }}
          onClick={(event) => event.stopPropagation()}
          onSubmit={onSubmit}
        >
          {fields}
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}

export function Press() {
  const { soft, viewport } = useMotionProfile()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const errorId = useId()

  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeModal = () => {
    setOpen(false)
    setPassword('')
    setError(false)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (password !== pressPack.password) {
      setError(true)
      inputRef.current?.select()
      return
    }

    window.open(pressPack.url, '_blank', 'noopener,noreferrer')
    closeModal()
  }

  const modal = (
    <PressModal
      open={open}
      soft={soft}
      titleId={titleId}
      errorId={errorId}
      password={password}
      error={error}
      inputRef={inputRef}
      onClose={closeModal}
      onSubmit={onSubmit}
      setPassword={setPassword}
      setError={setError}
    />
  )

  if (soft) {
    return (
      <section className="press" id="press">
        <div className="press__layout">
          <div className="press__panel">
            <p className="section-label">05 · Press</p>
            <h2 className="section-title">Press pack</h2>
            <p className="press__lede">
              Bio, photos and assets for promoters, press and collaborators.
            </p>

            <button
              type="button"
              className="press__link"
              onClick={() => setOpen(true)}
            >
              Go to presspack
            </button>
          </div>

          <figure className="press__visual">
            <img
              src="/images/press-socials.jpg"
              alt="KHWEZI K for press and DJ bookings"
              decoding="async"
            />
          </figure>
        </div>

        {modal}
      </section>
    )
  }

  return (
    <section className="press" id="press">
      <div className="press__layout">
        <motion.div
          className="press__panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <p className="section-label">05 · Press</p>
          <h2 className="section-title">Press pack</h2>
          <p className="press__lede">
            Bio, photos and assets for promoters, press and collaborators.
          </p>

          <button
            type="button"
            className="press__link"
            onClick={() => setOpen(true)}
          >
            Go to presspack
          </button>
        </motion.div>

        <motion.figure
          className="press__visual"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 1, ease: easeOut, delay: 0.12 }}
        >
          <img
            src="/images/press-socials.jpg"
            alt="KHWEZI K for press and DJ bookings"
          />
        </motion.figure>
      </div>

      {modal}
    </section>
  )
}
