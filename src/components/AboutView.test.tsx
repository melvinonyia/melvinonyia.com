import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

import { AboutView } from './AboutView'

describe('AboutView', () => {
  it('renders the About heading', () => {
    render(<AboutView />)
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })

  it('renders a short bio mentioning the work', () => {
    render(<AboutView />)
    expect(screen.getByText(/biomechanics and engineering/)).toBeInTheDocument()
  })

  it('renders GitHub, LinkedIn, and X social links', () => {
    render(<AboutView />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument()
  })

  it('renders a contact CTA linking to /contact', () => {
    render(<AboutView />)
    const cta = screen.getByRole('link', { name: /Get in touch/ })
    expect(cta).toHaveAttribute('href', '/contact')
  })
})
