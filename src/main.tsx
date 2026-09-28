import { MotionConfig } from 'framer-motion'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { isPublicSitePath, normalizePath } from './data/sections'
import {
  applyMotionDocumentClasses,
  useMotionProfile,
} from './hooks/useMotionProfile'
import {
  installSectionLinkInterception,
  migrateHashToPath,
  scheduleScrollToLocationSection,
} from './lib/sectionNav'
import { recordPageview } from './lib/traffic'
import { HiddenAnalytics } from './pages/HiddenAnalytics'
import { NotFound } from './pages/NotFound'
import './styles/global.css'

applyMotionDocumentClasses()

function PublicSite() {
  const { soft } = useMotionProfile()

  useEffect(() => {
    migrateHashToPath()
    void recordPageview()

    const cancelScroll = scheduleScrollToLocationSection('auto')
    const cancelIntercept = installSectionLinkInterception(() => {
      void recordPageview()
    })

    return () => {
      cancelScroll()
      cancelIntercept()
    }
  }, [])

  return (
    <MotionConfig reducedMotion={soft ? 'always' : 'user'}>
      <App />
    </MotionConfig>
  )
}

const path = normalizePath(window.location.pathname)

function resolveView() {
  if (path === '/hiddenanalytics') {
    return <HiddenAnalytics />
  }
  if (isPublicSitePath(path)) {
    return <PublicSite />
  }
  return <NotFound />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{resolveView()}</StrictMode>,
)
