import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...rest
  }: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

import { NotFoundView } from './NotFoundView'

describe('NotFoundView', () => {
  it('renders the "Sorry, the page is missing" heading', () => {
    render(<NotFoundView />)
    expect(screen.getByText('Sorry, the page is missing')).toBeInTheDocument()
  })

  it('renders the not-found subtitle', () => {
    render(<NotFoundView />)
    expect(
      screen.getByText(/couldn't find what you were looking for/i),
    ).toBeInTheDocument()
  })

  it('renders a Return Home link to / in the hero-button style', () => {
    render(<NotFoundView />)
    const link = screen.getByRole('link', { name: 'Return Home' })
    expect(link).toHaveAttribute('href', '/')
    expect(link.className).toMatch(/hero-button/)
  })
})
