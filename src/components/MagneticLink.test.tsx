import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { forwardRef } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    {
      to: string
      children: React.ReactNode
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ to, children, ...rest }, ref) => (
    <a ref={ref} href={to} {...rest}>
      {children}
    </a>
  )),
}))

import { MagneticLink } from './MagneticLink'

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

const ORIGINAL_GBCR = Element.prototype.getBoundingClientRect

function stubBoundingRect(rect: Partial<DOMRect>) {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 40,
    width: 100,
    height: 40,
    toJSON: () => '',
    ...rect,
  })) as () => DOMRect
}

beforeEach(() => {
  installMatchMedia(() => false)
})

afterEach(() => {
  Element.prototype.getBoundingClientRect = ORIGINAL_GBCR
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
})

describe('MagneticLink', () => {
  it('renders children inside an anchor pointing at `to`', () => {
    render(
      <MagneticLink to="/work">
        Visit work
      </MagneticLink>,
    )
    expect(screen.getByRole('link', { name: 'Visit work' })).toHaveAttribute(
      'href',
      '/work',
    )
  })

  it('forwards aria-label to the underlying link', () => {
    render(
      <MagneticLink to="/contact" aria-label="Contact Melvin">
        Get in touch
      </MagneticLink>,
    )
    expect(
      screen.getByRole('link', { name: 'Contact Melvin' }),
    ).toBeInTheDocument()
  })

  it('marks the anchor as disabled-magnetic when prefers-reduced-motion matches', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    render(
      <MagneticLink to="/work">label</MagneticLink>,
    )
    expect(screen.getByRole('link')).toHaveAttribute(
      'data-magnetic-disabled',
      'true',
    )
  })

  it('marks the anchor as disabled-magnetic when (hover: none) matches', () => {
    installMatchMedia((q) => q === '(hover: none)')
    render(<MagneticLink to="/work">label</MagneticLink>)
    expect(screen.getByRole('link')).toHaveAttribute(
      'data-magnetic-disabled',
      'true',
    )
  })

  it('keeps the underlying click target unaffected by a synthetic cursor offset', () => {
    stubBoundingRect({ left: 100, top: 200, right: 200, bottom: 240, width: 100, height: 40 })
    const onClick = vi.fn()
    render(
      <MagneticLink to="/work" onClick={onClick}>
        label
      </MagneticLink>,
    )
    const link = screen.getByRole('link')
    const beforeRect = link.getBoundingClientRect()
    // Cursor sits 20px right + 4px down of element center
    fireEvent.mouseMove(link, { clientX: 170, clientY: 224 })
    const afterRect = link.getBoundingClientRect()
    // The click hitbox (anchor bounds) does NOT shift even though inner content does
    expect(afterRect.left).toBe(beforeRect.left)
    expect(afterRect.top).toBe(beforeRect.top)
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('resets the inner translation on mouseleave (does not throw)', () => {
    stubBoundingRect({ left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 })
    render(<MagneticLink to="/work">label</MagneticLink>)
    const link = screen.getByRole('link')
    fireEvent.mouseMove(link, { clientX: 60, clientY: 24 })
    fireEvent.mouseLeave(link)
    expect(link).toBeInTheDocument()
  })
})
