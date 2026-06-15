import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    activeProps,
    activeOptions: _activeOptions,
    ...rest
  }: {
    to: string
    children: React.ReactNode
    activeProps?: Record<string, string>
    activeOptions?: unknown
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    void _activeOptions
    const ariaCurrent =
      typeof window !== 'undefined' && window.location?.pathname === to
        ? activeProps?.['aria-current']
        : undefined
    return (
      <a href={to} aria-current={ariaCurrent as 'page' | undefined} {...rest}>
        {children}
      </a>
    )
  },
}))

import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders all five primary nav items', () => {
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    const labels = links.map((l) => l.textContent)
    expect(labels).toEqual(['Home', 'Work', 'Writing', 'About', 'Contact'])
  })

  it('renders nav items as anchors pointing at their routes', () => {
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
    expect(within(nav).getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/writing')
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('renders a non-interactive ⌘K hint', () => {
    const { container } = render(<SiteHeader />)
    const kbd = container.querySelector('kbd')
    expect(kbd).not.toBeNull()
    expect(kbd!.textContent).toMatch(/⌘.*K/)
    expect(kbd).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the wordmark as a link back to home', () => {
    render(<SiteHeader />)
    const brand = screen.getByRole('link', { name: 'Melvin Onyia' })
    expect(brand).toHaveAttribute('href', '/')
  })
})
