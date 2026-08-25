/** Hidden analytics — not linked from the public site. */
export const analyticsGate = {
  /** Unlock password for /hiddenanalytics */
  password: 'kanalytics',
} as const

/** Abacus counter namespace (CountAPI replacement). */
export const trafficNamespace = 'khwezik-com' as const

export const trackedPaths = [
  { id: 'home', label: 'Home', match: (path: string, hash: string) => path === '/' && !hash },
  { id: 'about', label: 'About', match: (_p: string, hash: string) => hash === '#about' },
  { id: 'sets', label: 'Sets', match: (_p: string, hash: string) => hash === '#sets' },
  { id: 'collabs', label: 'Collabs', match: (_p: string, hash: string) => hash === '#collabs' },
  { id: 'contact', label: 'Contact', match: (_p: string, hash: string) => hash === '#contact' },
  { id: 'press', label: 'Press', match: (_p: string, hash: string) => hash === '#press' },
  { id: 'socials', label: 'Socials', match: (_p: string, hash: string) => hash === '#socials' },
] as const
