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
  it('renders the 500 heading and on-brand copy', () => {
    render(<ServerErrorView />)
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Something gave way.' }),
    ).toBeInTheDocument()
  })

  it('renders a link back to the home page', () => {
    render(<ServerErrorView />)
    expect(screen.getByRole('link', { name: /Take me home/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('renders a ⌘K hint that triggers the palette context on click', () => {
    render(<ServerErrorView />)
    const trigger = screen.getByRole('button', { name: /Search with/i })
    expect(trigger.textContent).toMatch(/⌘K/)
    fireEvent.click(trigger)
    expect(openPaletteMock).toHaveBeenCalledTimes(1)
  })
})
