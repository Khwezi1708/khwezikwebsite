/** Hidden analytics — not linked from the public site. */
export const analyticsGate = {
  /** Unlock password for /hiddenanalytics */
  password: 'kanalytics',
} as const

/** Abacus counter namespace (CountAPI replacement). */
export const trafficNamespace = 'khwezik-com' as const

export const trackedPaths = [
  {
    id: 'home',
    label: 'Home',
    match: (path: string, _hash: string) => path === '/',
  },
  {
    id: 'about',
    label: 'About',
    match: (path: string, hash: string) =>
      path === '/about' || hash === '#about',
  },
  {
    id: 'sets',
    label: 'Sets',
    match: (path: string, hash: string) =>
      path === '/sets' || hash === '#sets',
  },
  {
    id: 'gigs',
    label: 'Gigs',
    match: (path: string, hash: string) =>
      path === '/gigs' || hash === '#gigs',
  },
  {
    id: 'collabs',
    label: 'Collabs',
    match: (path: string, hash: string) =>
      path === '/collabs' || hash === '#collabs',
  },
  {
    id: 'contact',
    label: 'Contact',
    match: (path: string, hash: string) =>
      path === '/contact' || hash === '#contact',
  },
  {
    id: 'press',
    label: 'Press',
    match: (path: string, hash: string) =>
      path === '/press' || hash === '#press',
  },
  {
    id: 'socials',
    label: 'Socials',
    match: (path: string, hash: string) =>
      path === '/socials' || hash === '#socials',
  },
] as const
