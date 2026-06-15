/**
 * Per-route palette resolver.
 *
 * Article detail routes (/writing/$slug, /work/$slug) render on the paper
 * palette — light cream bg, near-black foreground. Everything else stays
 * on the dark palette.
 */

const PAPER_PATH = /^\/(writing|work)\/[^/]+\/?$/

export type Palette = 'paper' | 'dark'

export function paletteForPath(pathname: string): Palette {
  return PAPER_PATH.test(pathname) ? 'paper' : 'dark'
}
