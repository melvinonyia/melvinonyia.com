import { render, screen } from '@testing-library/react'
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
  it('renders the About heading in display serif', () => {
    render(<AboutView />)
    const heading = screen.getByRole('heading', { level: 1, name: 'About' })
    expect(heading).toBeInTheDocument()
    expect(heading.className).toMatch(/font-serif/)
  })

  it('renders a mono dateline with the current role', () => {
    render(<AboutView />)
    // The bio paragraph also contains "staff software engineer" in lowercase;
    // scope the assertion to the mono dateline below the heading.
    const dateline = screen.getByText(/Staff Software Engineer — /)
    expect(dateline).toBeInTheDocument()
    expect(dateline.className).toMatch(/font-mono/)
  })

  it('renders the bio mentioning the work', () => {
    render(<AboutView />)
    expect(screen.getByText(/biomechanics and engineering/)).toBeInTheDocument()
  })

  it('renders GitHub, LinkedIn, X, and Email in the links cluster', () => {
    render(<AboutView />)
    const cluster = screen.getByRole('navigation', { name: /Find me elsewhere/i })
    expect(cluster).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('target', '_blank')
    const email = screen.getByRole('link', { name: 'Email' })
    expect(email.getAttribute('href')).toMatch(/^mailto:/)
    expect(email).not.toHaveAttribute('target')
  })

  it('opens external links with safe rel', () => {
    render(<AboutView />)
    const github = screen.getByRole('link', { name: 'GitHub' })
    expect(github.getAttribute('rel')).toMatch(/noreferrer/)
    expect(github.getAttribute('rel')).toMatch(/noopener/)
  })

  it('renders a contact CTA linking to /contact in serif', () => {
    render(<AboutView />)
    const cta = screen.getByRole('link', { name: /Get in touch/ })
    expect(cta).toHaveAttribute('href', '/contact')
    expect(cta.className).toMatch(/font-serif/)
  })
})
