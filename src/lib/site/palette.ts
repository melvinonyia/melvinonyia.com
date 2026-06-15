export type RoutePalette = 'dark' | 'paper'

const PAPER_PREFIXES = ['/writing', '/about'] as const

export function getPaletteForPath(pathname: string): RoutePalette {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  for (const prefix of PAPER_PREFIXES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return 'paper'
    }
  }
  return 'dark'
}
