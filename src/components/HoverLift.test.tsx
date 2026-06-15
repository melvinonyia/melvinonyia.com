import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { HoverLift } from './HoverLift'

function installMatchMedia(matcher: (query: string) => boolean) {
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

afterEach(() => {
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
})

describe('HoverLift', () => {
  it('renders its children inside a wrapping element', () => {
    installMatchMedia(() => false)
    render(
      <HoverLift>
        <a href="/x">child link</a>
      </HoverLift>,
    )
    expect(screen.getByRole('link', { name: 'child link' })).toBeInTheDocument()
  })

  it('preserves a child link role and label (ARIA passthrough)', () => {
    installMatchMedia(() => false)
    render(
      <HoverLift>
        <button type="button" aria-label="open card">
          card
        </button>
      </HoverLift>,
    )
    expect(screen.getByRole('button', { name: 'open card' })).toBeInTheDocument()
  })

  it('renders an aria-hidden rule element inside the wrapper', () => {
    installMatchMedia(() => false)
    const { container } = render(
      <HoverLift>
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    const rule = wrapper.querySelector('[data-hover-rule]')
    expect(rule).not.toBeNull()
    expect(rule).toHaveAttribute('aria-hidden', 'true')
  })

  it('also renders the rule element under reduced-motion (CSS path)', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    const { container } = render(
      <HoverLift>
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    expect(wrapper.querySelector('[data-hover-rule]')).not.toBeNull()
  })

  it('marks the wrapper with reduced-motion when prefers-reduced-motion matches', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    const { container } = render(
      <HoverLift>
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    expect(wrapper.getAttribute('data-reduced-motion')).toBe('true')
    expect(wrapper.getAttribute('data-touch-only')).toBe('false')
  })

  it('marks the wrapper with touch-only when (hover: none) matches', () => {
    installMatchMedia((q) => q === '(hover: none)')
    const { container } = render(
      <HoverLift>
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    expect(wrapper.getAttribute('data-touch-only')).toBe('true')
  })

  it('defaults to motion-spring + hover when neither media query matches', () => {
    installMatchMedia(() => false)
    const { container } = render(
      <HoverLift>
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    expect(wrapper.getAttribute('data-reduced-motion')).toBe('false')
    expect(wrapper.getAttribute('data-touch-only')).toBe('false')
  })

  it('forwards an optional className to the wrapper', () => {
    installMatchMedia(() => false)
    const { container } = render(
      <HoverLift className="h-full">
        <span>content</span>
      </HoverLift>,
    )
    const wrapper = container.querySelector('[data-hover-lift]')!
    expect(wrapper.className).toMatch(/relative/)
    expect(wrapper.className).toMatch(/h-full/)
  })
})
