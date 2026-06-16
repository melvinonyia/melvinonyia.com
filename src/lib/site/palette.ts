/**
 * Per-route palette resolver.
 *
 * Piece and Case study detail routes (/writing/$slug, /work/$slug) render
 * on the paper palette — light cream Ground, near-black Ink. Everything
 * else stays on the dark palette.
 */

const PAPER_PATH = /^\/(writing|work)\/[^/]+\/?$/

export type Palette = 'paper' | 'dark'

export function paletteForPath(pathname: string): Palette {
  return PAPER_PATH.test(pathname) ? 'paper' : 'dark'
}
