import { describe, expect, it } from 'vitest'
import { getPaletteForPath } from './palette'

describe('getPaletteForPath', () => {
  it.each([
    ['/', 'dark'],
    ['/work', 'dark'],
    ['/work/movement-fingerprint', 'dark'],
    ['/work/gait-lab-toolkit', 'dark'],
    ['/contact', 'dark'],
    ['/404', 'dark'],
    ['/500', 'dark'],
    ['/legal', 'dark'],
  ] as const)('maps %s to dark', (path, expected) => {
    expect(getPaletteForPath(path)).toBe(expected)
  })

  it.each([
    ['/writing', 'paper'],
    ['/writing/the-leg-between-lab-and-field', 'paper'],
    ['/about', 'paper'],
  ] as const)('maps %s to paper', (path, expected) => {
    expect(getPaletteForPath(path)).toBe(expected)
  })

  it('ignores trailing slashes', () => {
    expect(getPaletteForPath('/writing/')).toBe('paper')
    expect(getPaletteForPath('/about/')).toBe('paper')
    expect(getPaletteForPath('/work/')).toBe('dark')
  })

  it('does not match a path that merely starts with the same letters', () => {
    // `/writings` should not be treated as a /writing route, and `/aboutme`
    // is not /about. The matcher checks for exact match or `/<prefix>/`.
    expect(getPaletteForPath('/writings')).toBe('dark')
    expect(getPaletteForPath('/aboutme')).toBe('dark')
  })

  it('defaults unknown paths to dark', () => {
    expect(getPaletteForPath('/blog/anything')).toBe('dark')
    expect(getPaletteForPath('/nowhere')).toBe('dark')
  })
})
