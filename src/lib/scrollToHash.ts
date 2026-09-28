/** Scroll to `location.hash` after SPA mount (browser hash scroll is lost when React replaces prerender HTML). */
export function scrollToLocationHash(): boolean {
  const raw = window.location.hash
  if (!raw || raw === '#') return false

  const id = decodeURIComponent(raw.slice(1))
  if (!id) return false

  const el = document.getElementById(id)
  if (!el) return false

  el.scrollIntoView({ behavior: 'auto', block: 'start' })
  return true
}

/** Retry while layout settles (fonts, images, late section mount). */
export function scheduleScrollToLocationHash(): () => void {
  if (!window.location.hash || window.location.hash === '#') {
    return () => {}
  }

  const delays = [0, 50, 150, 400, 900]
  const timers: number[] = []
  let frame = 0

  const run = () => {
    scrollToLocationHash()
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
