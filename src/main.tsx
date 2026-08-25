import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HiddenAnalytics } from './pages/HiddenAnalytics'
import { recordPageview } from './lib/traffic'
import './styles/global.css'

function PublicSite() {
  useEffect(() => {
    void recordPageview()

    const onHashChange = () => {
      void recordPageview()
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return <App />
}

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isAnalytics = path === '/hiddenanalytics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAnalytics ? <HiddenAnalytics /> : <PublicSite />}
  </StrictMode>,
)
