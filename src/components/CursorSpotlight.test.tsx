import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

function installMatchMedia(matcher: (q: string) => boolean) {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: matcher(query),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
}

let rafQueue: FrameRequestCallback[] = []
let rafCalls = 0
function flushRaf() {
  const queue = rafQueue
  rafQueue = []
  queue.forEach((cb) => cb(0))
}

const ORIGINAL_GBCR = Element.prototype.getBoundingClientRect
function stubGBCR(rect: Partial<DOMRect>) {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 200,
    bottom: 100,
    width: 200,
    height: 100,
    toJSON: () => '',
    ...rect,
  })) as () => DOMRect
}

beforeEach(() => {
  installMatchMedia(() => false)
  rafQueue = []
  rafCalls = 0
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafCalls += 1
    rafQueue.push(cb)
    return rafCalls
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  Element.prototype.getBoundingClientRect = ORIGINAL_GBCR
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
  cleanup()
})

import { CursorSpotlight } from './CursorSpotlight'

describe('CursorSpotlight', () => {
  it('renders children', () => {
    render(<CursorSpotlight>hello</CursorSpotlight>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('exposes a presentation-role gradient layer when enabled', () => {
    const { container } = render(<CursorSpotlight>x</CursorSpotlight>)
    expect(container.querySelector('[role="presentation"]')).toBeTruthy()
  })

  it('writes --mx/--my onto the wrapper on mousemove after the rAF flushes', () => {
    stubGBCR({ left: 0, top: 0, width: 200, height: 100 })
    const { container } = render(<CursorSpotlight>x</CursorSpotlight>)
    const wrapper = container.querySelector('[data-cursor-spotlight]') as HTMLElement
    fireEvent.mouseMove(wrapper, { clientX: 50, clientY: 25 })
    flushRaf()
    expect(wrapper.style.getPropertyValue('--mx')).toBe('50px')
    expect(wrapper.style.getPropertyValue('--my')).toBe('25px')
  })

  it('batches multiple mousemoves into a single rAF schedule', () => {
    stubGBCR({ left: 0, top: 0, width: 200, height: 100 })
    const { container } = render(<CursorSpotlight>x</CursorSpotlight>)
    const wrapper = container.querySelector('[data-cursor-spotlight]') as HTMLElement
    const before = rafCalls
    fireEvent.mouseMove(wrapper, { clientX: 10, clientY: 5 })
    fireEvent.mouseMove(wrapper, { clientX: 20, clientY: 10 })
    fireEvent.mouseMove(wrapper, { clientX: 30, clientY: 15 })
    expect(rafCalls - before).toBe(1)
    flushRaf()
    expect(wrapper.style.getPropertyValue('--mx')).toBe('30px')
    expect(wrapper.style.getPropertyValue('--my')).toBe('15px')
  })

  it('renders as a transparent no-op when prefers-reduced-motion matches', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    const { container } = render(<CursorSpotlight>x</CursorSpotlight>)
    const wrapper = container.querySelector('[data-cursor-spotlight]') as HTMLElement
    expect(wrapper.getAttribute('data-cursor-spotlight-disabled')).toBe('true')
    expect(container.querySelector('[role="presentation"]')).toBeFalsy()
  })

  it('renders as a transparent no-op when (hover: none) matches', () => {
    installMatchMedia((q) => q === '(hover: none)')
    const { container } = render(<CursorSpotlight>x</CursorSpotlight>)
    const wrapper = container.querySelector('[data-cursor-spotlight]') as HTMLElement
    expect(wrapper.getAttribute('data-cursor-spotlight-disabled')).toBe('true')
    expect(container.querySelector('[role="presentation"]')).toBeFalsy()
  })

  it('detaches its mousemove listener on unmount', () => {
    stubGBCR({})
    const { container, unmount } = render(<CursorSpotlight>x</CursorSpotlight>)
    const wrapper = container.querySelector('[data-cursor-spotlight]') as HTMLElement
    const removeSpy = vi.spyOn(wrapper, 'removeEventListener')
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
  })
})
