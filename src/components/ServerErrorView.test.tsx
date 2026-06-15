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

import { ServerErrorView } from './ServerErrorView'

describe('ServerErrorView', () => {
  it('renders the serif 500 as the page heading', () => {
    render(<ServerErrorView />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('500')
    expect(h1.className).toMatch(/font-serif/)
  })

  it('renders the friendly subtitle "Something gave way." below the error code', () => {
    const { container } = render(<ServerErrorView />)
    const subtitle = container.querySelector('[data-server-error-subtitle]')
    expect(subtitle).not.toBeNull()
    expect(subtitle).toHaveTextContent('Something gave way.')
  })

  it('renders a serif link back to the home page', () => {
    render(<ServerErrorView />)
    const home = screen.getByRole('link', { name: /Take me home/i })
    expect(home).toHaveAttribute('href', '/')
    expect(home.className).toMatch(/font-serif/)
  })

  it('renders a ⌘K hint button with a11y wiring that triggers the palette', () => {
    render(<ServerErrorView />)
    const trigger = screen.getByRole('button', { name: /Open command palette/i })
    expect(trigger.textContent).toMatch(/⌘K/)
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K')
    fireEvent.click(trigger)
    expect(openPaletteMock).toHaveBeenCalledTimes(1)
  })
})
