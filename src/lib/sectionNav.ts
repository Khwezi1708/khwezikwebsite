import {
  isSectionPath,
  normalizePath,
  pathFromSectionId,
  sectionIdFromPath,
} from '../data/sections'

function scrollToId(id: string, behavior: ScrollBehavior = 'auto'): boolean {
  if (id === 'top') {
    window.scrollTo({ top: 0, left: 0, behavior })
    return true
  }

  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

/** Scroll to the section for the current pathname. */
export function scrollToLocationSection(
  behavior: ScrollBehavior = 'auto',
): boolean {
  const id = sectionIdFromPath(window.location.pathname)
  if (!id) return false
  return scrollToId(id, behavior)
}

/** Old `#sets` bookmarks → `/sets` (keeps history entry tidy). */
export function migrateHashToPath(): boolean {
  const hash = window.location.hash.split('?')[0] || ''
  if (!hash || hash === '#') return false

  const id = decodeURIComponent(hash.slice(1))
  const path = pathFromSectionId(id)
  if (!path) return false

  const url = path === '/' ? '/' : path
  window.history.replaceState(null, '', url)
  return true
}

/** Retry while layout settles after SPA mount / navigation. */
export function scheduleScrollToLocationSection(
  behavior: ScrollBehavior = 'auto',
): () => void {
  if (!isSectionPath(window.location.pathname)) {
    return () => {}
  }

  const delays = [0, 50, 150, 400, 900]
  const timers: number[] = []
  let frame = 0

  const run = () => {
    scrollToLocationSection(behavior)
  }

  frame = window.requestAnimationFrame(run)
  for (const ms of delays) {
    timers.push(window.setTimeout(run, ms))
  }

  void document.fonts?.ready.then(run)

  return () => {
    window.cancelAnimationFrame(frame)
    for (const id of timers) window.clearTimeout(id)
  }
}

type NavigateOptions = {
  replace?: boolean
  behavior?: ScrollBehavior
  onNavigate?: () => void
}

/** Client-side navigate to a section path and scroll. */
export function navigateToSectionPath(
  pathname: string,
  options: NavigateOptions = {},
): boolean {
  const path = normalizePath(pathname)
  if (!isSectionPath(path)) return false

  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', path)
  scheduleScrollToLocationSection(options.behavior ?? 'smooth')
  options.onNavigate?.()
  return true
}

/**
 * Intercept same-origin section links so `/sets` does not full-reload.
 * Returns cleanup.
 */
export function installSectionLinkInterception(onNavigate?: () => void): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = event.target
    if (!(target instanceof Element)) return

    const anchor = target.closest('a')
    if (!(anchor instanceof HTMLAnchorElement)) return
    if (anchor.target && anchor.target !== '_self') return
    if (anchor.hasAttribute('download')) return

    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin) return
    if (url.search) return
    if (!isSectionPath(url.pathname)) return

    // Allow hash-only legacy hrefs that map to sections via migrate — prefer path hrefs.
    event.preventDefault()
    navigateToSectionPath(url.pathname, {
      behavior: 'smooth',
      onNavigate,
    })
  }

  const onPopState = () => {
    scheduleScrollToLocationSection('auto')
    onNavigate?.()
  }

  document.addEventListener('click', onClick)
  window.addEventListener('popstate', onPopState)

  return () => {
    document.removeEventListener('click', onClick)
    window.removeEventListener('popstate', onPopState)
  }
}
