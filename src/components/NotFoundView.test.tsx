import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { forwardRef } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ to, children, ...rest }, ref) => (
    <a ref={ref} href={to} {...rest}>
      {children}
    </a>
  )),
}))

const openPaletteMock = vi.fn()
vi.mock('./CommandPaletteController', () => ({
  useOpenCommandPalette: () => openPaletteMock,
}))

afterEach(() => {
  openPaletteMock.mockReset()
  cleanup()
})

import { NotFoundView } from './NotFoundView'

describe('NotFoundView', () => {
  it('renders the serif 404 as the page heading', () => {
    render(<NotFoundView />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('404')
    expect(h1.className).toMatch(/font-serif/)
  })

  it('renders the friendly subtitle "Off the map." below the error code', () => {
    const { container } = render(<NotFoundView />)
    const subtitle = container.querySelector('[data-not-found-subtitle]')
    expect(subtitle).not.toBeNull()
    expect(subtitle).toHaveTextContent('Off the map.')
  })

  it('renders a serif link back to the home page', () => {
    render(<NotFoundView />)
    const home = screen.getByRole('link', { name: /Take me home/i })
    expect(home).toHaveAttribute('href', '/')
    expect(home.className).toMatch(/font-serif/)
  })

  it('renders a ⌘K hint button with a11y wiring that triggers the palette', () => {
    render(<NotFoundView />)
    const trigger = screen.getByRole('button', { name: /Open command palette/i })
    expect(trigger.textContent).toMatch(/⌘K/)
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K')
    fireEvent.click(trigger)
    expect(openPaletteMock).toHaveBeenCalledTimes(1)
  })
})
