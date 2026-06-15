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

import { ServerErrorView } from './ServerErrorView'

describe('ServerErrorView', () => {
  it('renders the Sorry! heading', () => {
    render(<ServerErrorView />)
    expect(screen.getByText('Sorry!')).toBeInTheDocument()
  })

  it('renders the something went wrong subtitle', () => {
    render(<ServerErrorView />)
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('renders a Try again link to home in the hero-button style', () => {
    render(<ServerErrorView />)
    const link = screen.getByRole('link', { name: 'Try again' })
    expect(link).toHaveAttribute('href', '/')
    expect(link.className).toMatch(/hero-button/)
  })
})
