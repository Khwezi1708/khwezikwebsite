/** In-page section routes (single-page site with path URLs). */
export type SectionRoute = {
  path: string
  /** DOM id used as scroll target */
  id: string
  label: string
}

export const sectionRoutes: readonly SectionRoute[] = [
  { path: '/', id: 'top', label: 'Home' },
  { path: '/about', id: 'about', label: 'About' },
  { path: '/sets', id: 'sets', label: 'Sets' },
  { path: '/gigs', id: 'gigs', label: 'Gigs' },
  { path: '/collabs', id: 'collabs', label: 'Collabs' },
  { path: '/contact', id: 'contact', label: 'Contact' },
  { path: '/press', id: 'press', label: 'Press' },
  { path: '/socials', id: 'socials', label: 'Socials' },
] as const

export const navLinks = sectionRoutes.filter((route) => route.path !== '/')

const pathToId = new Map(
  sectionRoutes.map((route) => [route.path, route.id] as const),
)

const idToPath = new Map(
  sectionRoutes.map((route) => [route.id, route.path] as const),
)

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  return trimmed
}

export function isSectionPath(pathname: string): boolean {
  return pathToId.has(normalizePath(pathname))
}

export function sectionIdFromPath(pathname: string): string | null {
  return pathToId.get(normalizePath(pathname)) ?? null
}

export function pathFromSectionId(id: string): string | null {
  return idToPath.get(id) ?? null
}

export function isPublicSitePath(pathname: string): boolean {
  const path = normalizePath(pathname)
  return path === '/' || isSectionPath(path)
}
