import { render, screen, within } from '@testing-library/react'
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

import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders the Melvin Onyia wordmark', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText('Melvin Onyia')).toBeInTheDocument()
  })

  it('renders the four primary nav links pointing at the right routes', () => {
    render(<SiteFooter year={2026} />)
    const nav = screen.getByRole('navigation', { name: 'Footer' })
    expect(within(nav).getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
    expect(within(nav).getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/writing')
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('renders GitHub, LinkedIn, and X as social text-links opening in new tabs', () => {
    render(<SiteFooter year={2026} />)
    const social = screen.getByRole('navigation', { name: 'Social' })
    const github = within(social).getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noreferrer noopener')
    expect(within(social).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(within(social).getByRole('link', { name: 'X' })).toBeInTheDocument()
  })

  it('renders the copyright with the year and Privacy + Terms links', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText(/© 2026 Melvin Onyia/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
  })
})
