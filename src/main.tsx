import { MotionConfig } from 'framer-motion'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  applyMotionDocumentClasses,
  useMotionProfile,
} from './hooks/useMotionProfile'
import { HiddenAnalytics } from './pages/HiddenAnalytics'
import { NotFound } from './pages/NotFound'
import { recordPageview } from './lib/traffic'
import './styles/global.css'

applyMotionDocumentClasses()

function PublicSite() {
  const { soft } = useMotionProfile()

  useEffect(() => {
    void recordPageview()

    const onHashChange = () => {
      void recordPageview()
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <MotionConfig reducedMotion={soft ? 'always' : 'user'}>
      <App />
    </MotionConfig>
  )
}

const path = window.location.pathname.replace(/\/+$/, '') || '/'

function resolveView() {
  switch (path) {
    case '/':
      return <PublicSite />
    case '/hiddenanalytics':
      return <HiddenAnalytics />
    default:
      return <NotFound />
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{resolveView()}</StrictMode>,
)
