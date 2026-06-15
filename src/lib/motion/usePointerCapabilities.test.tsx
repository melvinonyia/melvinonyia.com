import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useReducedMotionPreferred, useTouchOnly } from './usePointerCapabilities'

interface MockMQ {
  query: string
  matches: boolean
  listeners: Set<(e: MediaQueryListEvent) => void>
}

let mocks: MockMQ[] = []

function installMatchMedia(matcher: (query: string) => boolean) {
  mocks = []
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) => {
      const mock: MockMQ = { query, matches: matcher(query), listeners: new Set() }
      mocks.push(mock)
      return {
        matches: mock.matches,
        media: query,
        onchange: null,
        addEventListener: (_evt: string, cb: (e: MediaQueryListEvent) => void) =>
          mock.listeners.add(cb),
        removeEventListener: (_evt: string, cb: (e: MediaQueryListEvent) => void) =>
          mock.listeners.delete(cb),
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      } as unknown as MediaQueryList
    },
  )
}

function fireChange(query: string, matches: boolean) {
  const mock = mocks.find((m) => m.query === query)
  if (!mock) throw new Error(`No mock for query ${query}`)
  mock.matches = matches
  mock.listeners.forEach((l) =>
    l({ matches, media: query } as unknown as MediaQueryListEvent),
  )
}

afterEach(() => {
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
})

describe('useReducedMotionPreferred', () => {
  it('returns false when the user has no preference', () => {
    installMatchMedia(() => false)
    const { result } = renderHook(() => useReducedMotionPreferred())
    expect(result.current).toBe(false)
  })

  it('returns true when matchMedia matches reduced-motion', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    const { result } = renderHook(() => useReducedMotionPreferred())
    expect(result.current).toBe(true)
  })

  it('reacts to a media-query change event', () => {
    installMatchMedia(() => false)
    const { result } = renderHook(() => useReducedMotionPreferred())
    expect(result.current).toBe(false)
    act(() => fireChange('(prefers-reduced-motion: reduce)', true))
    expect(result.current).toBe(true)
  })
})

describe('useTouchOnly', () => {
  it('returns false on hover-capable devices', () => {
    installMatchMedia(() => false)
    const { result } = renderHook(() => useTouchOnly())
    expect(result.current).toBe(false)
  })

  it('returns true when (hover: none) matches', () => {
    installMatchMedia((q) => q === '(hover: none)')
    const { result } = renderHook(() => useTouchOnly())
    expect(result.current).toBe(true)
  })

  it('reacts to a media-query change event', () => {
    installMatchMedia(() => false)
    const { result } = renderHook(() => useTouchOnly())
    expect(result.current).toBe(false)
    act(() => fireChange('(hover: none)', true))
    expect(result.current).toBe(true)
  })
})
