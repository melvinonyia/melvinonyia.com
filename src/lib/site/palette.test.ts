import { describe, it, expect } from 'vitest'
import { paletteForPath } from './palette'

describe('paletteForPath', () => {
  it('returns "paper" for individual writing posts', () => {
    expect(paletteForPath('/writing/some-essay')).toBe('paper')
  })

  it('returns "paper" for individual work posts', () => {
    expect(paletteForPath('/work/movement-fingerprint')).toBe('paper')
  })

  it('returns "dark" for the writing index', () => {
    expect(paletteForPath('/writing')).toBe('dark')
  })

  it('returns "dark" for the work index', () => {
    expect(paletteForPath('/work')).toBe('dark')
  })

  it('returns "dark" for home, about, contact, privacy, terms', () => {
    expect(paletteForPath('/')).toBe('dark')
    expect(paletteForPath('/about')).toBe('dark')
    expect(paletteForPath('/contact')).toBe('dark')
    expect(paletteForPath('/privacy')).toBe('dark')
    expect(paletteForPath('/terms')).toBe('dark')
  })
})
