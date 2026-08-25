import { useEffect } from 'react'
import { BrandMark } from '../components/BrandMark'
import './NotFound.css'

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · KHWEZI K'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => {
      robots.remove()
    }
  }, [])

  return (
    <main className="not-found">
      <div className="not-found__glow" aria-hidden="true" />
      <p className="not-found__code">404</p>
      <BrandMark className="not-found__mark" alt="" />
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__lede">
        The page you are looking for does not exist.
      </p>
      <a className="not-found__cta" href="/">
        Back home
      </a>
    </main>
  )
}
