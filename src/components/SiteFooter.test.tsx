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

import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders GitHub, LinkedIn, and X social links', () => {
    render(<SiteFooter year={2026} />)
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: 'X' })).toBeInTheDocument()
  })

  it('opens social links in a new tab with safe rel', () => {
    render(<SiteFooter year={2026} />)
    const github = screen.getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github.getAttribute('rel')).toMatch(/noreferrer/)
    expect(github.getAttribute('rel')).toMatch(/noopener/)
  })

  it('renders the copyright wordmark with the passed-in year', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText(/© 2026 Melvin Onyia/)).toBeInTheDocument()
  })

  it('renders a legal link stub', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByRole('link', { name: 'Legal' })).toHaveAttribute('href', '/legal')
  })

  it('renders a ⌘K trigger button with the keyboard-shortcut a11y wiring', () => {
    const { container } = render(<SiteFooter year={2026} />)
    const trigger = container.querySelector(
      '[data-palette-trigger]',
    ) as HTMLButtonElement | null
    expect(trigger).not.toBeNull()
    expect(trigger!.tagName).toBe('BUTTON')
    expect(trigger!.textContent).toMatch(/⌘K/)
    expect(trigger).toHaveAttribute('aria-label', 'Open command palette')
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K')
  })
})
