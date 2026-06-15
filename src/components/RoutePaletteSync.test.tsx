import { render, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

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

const docAny = document as unknown as { startViewTransition?: unknown }
const ORIGINAL_START_VIEW_TRANSITION = docAny.startViewTransition

function stubStartViewTransition(impl?: (cb: () => void | Promise<void>) => unknown) {
  const defaultImpl = (cb: () => void | Promise<void>) => {
    void cb()
    return { finished: Promise.resolve() }
  }
  docAny.startViewTransition = vi.fn(impl ?? defaultImpl)
}

function removeStartViewTransition() {
  docAny.startViewTransition = undefined
}

function setCurrentPalette(palette: 'dark' | 'paper') {
  document.documentElement.setAttribute('data-palette', palette)
}

function clearPalette() {
  document.documentElement.removeAttribute('data-palette')
  document.documentElement.removeAttribute('data-palette-transition')
}

beforeEach(() => {
  installMatchMedia(() => false)
  navigateMock.mockReset()
  setCurrentPalette('dark')
})

afterEach(() => {
  if (ORIGINAL_START_VIEW_TRANSITION === undefined) {
    removeStartViewTransition()
  } else {
    docAny.startViewTransition = ORIGINAL_START_VIEW_TRANSITION
  }
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
  clearPalette()
  cleanup()
})

import { RoutePaletteSync } from './RoutePaletteSync'

function renderWithLink(href: string) {
  return render(
    <>
      <RoutePaletteSync />
      <a href={href} data-testid="link">
        go
      </a>
    </>,
  )
}

function clickLink(container: HTMLElement) {
  const link = container.querySelector('[data-testid="link"]') as HTMLAnchorElement
  const evt = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
  link.dispatchEvent(evt)
  return evt
}

describe('RoutePaletteSync', () => {
  it('starts a view transition on cross-palette link clicks when the API is available', () => {
    stubStartViewTransition()
    const { container } = renderWithLink('/writing')
    const evt = clickLink(container)
    expect(evt.defaultPrevented).toBe(true)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith(expect.objectContaining({ to: '/writing' }))
    expect(document.documentElement.getAttribute('data-palette-transition')).toBe('true')
  })

  it('clears the data-palette-transition marker after the transition finishes', async () => {
    stubStartViewTransition()
    const { container } = renderWithLink('/about')
    clickLink(container)
    expect(document.documentElement.getAttribute('data-palette-transition')).toBe('true')
    await Promise.resolve()
    await Promise.resolve()
    expect(document.documentElement.hasAttribute('data-palette-transition')).toBe(false)
  })

  it('does not intercept same-palette link clicks', () => {
    stubStartViewTransition()
    const { container } = renderWithLink('/work')
    const evt = clickLink(container)
    expect(evt.defaultPrevented).toBe(false)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('falls through to default navigation when startViewTransition is unavailable', () => {
    removeStartViewTransition()
    const { container } = renderWithLink('/writing')
    const evt = clickLink(container)
    expect(evt.defaultPrevented).toBe(false)
    expect(navigateMock).not.toHaveBeenCalled()
    expect(document.documentElement.hasAttribute('data-palette-transition')).toBe(false)
  })

  it('falls through to default navigation when prefers-reduced-motion matches', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    stubStartViewTransition()
    const { container } = renderWithLink('/writing')
    const evt = clickLink(container)
    expect(evt.defaultPrevented).toBe(false)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('ignores modifier-key clicks and middle/right-button clicks', () => {
    stubStartViewTransition()
    const { container } = renderWithLink('/writing')
    const link = container.querySelector('[data-testid="link"]') as HTMLAnchorElement
    ;[
      { metaKey: true },
      { ctrlKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
      { button: 2 },
    ].forEach((init) => {
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true, ...init })
      link.dispatchEvent(evt)
    })
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('ignores external, hash, mailto, and target=_blank links', () => {
    stubStartViewTransition()
    ;[
      'https://example.com/writing',
      '//example.com/writing',
      'mailto:hello@example.com',
      '#section',
    ].forEach((href) => {
      const { container, unmount } = renderWithLink(href)
      const evt = clickLink(container)
      expect(evt.defaultPrevented).toBe(false)
      unmount()
    })
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
  })
})
