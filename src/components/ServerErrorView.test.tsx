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
  it('renders the "Sorry, you found a glitch" heading', () => {
    render(<ServerErrorView />)
    expect(screen.getByText('Sorry, you found a glitch')).toBeInTheDocument()
  })

  it('renders the Something went wrong subtitle', () => {
    render(<ServerErrorView />)
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('renders a Return Home link to / in the hero-button style', () => {
    render(<ServerErrorView />)
    const link = screen.getByRole('link', { name: 'Return Home' })
    expect(link).toHaveAttribute('href', '/')
    expect(link.className).toMatch(/hero-button/)
  })
})
