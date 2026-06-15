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
  it('renders the Sorry! heading', () => {
    render(<NotFoundView />)
    expect(screen.getByText('Sorry!')).toBeInTheDocument()
  })

  it('renders the not-available subtitle', () => {
    render(<NotFoundView />)
    expect(
      screen.getByText(/page you are looking for is not available/),
    ).toBeInTheDocument()
  })

  it('renders a Try again link to home in the hero-button style', () => {
    render(<NotFoundView />)
    const link = screen.getByRole('link', { name: 'Try again' })
    expect(link).toHaveAttribute('href', '/')
    expect(link.className).toMatch(/hero-button/)
  })
})
