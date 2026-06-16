import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()

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
  useNavigate: () => navigateMock,
}))

import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  beforeEach(() => navigateMock.mockReset())

  it('renders the M logo as a link back to home', () => {
    render(<SiteHeader />)
    const brand = screen.getByRole('link', { name: 'Home' })
    expect(brand).toHaveAttribute('href', '/')
  })

  it('renders a hamburger button that toggles aria-expanded', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: 'menu-icon' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders Work, Writing, About, Contact in the drawer', () => {
    const { container } = render(<SiteHeader />)
    const items = container.querySelectorAll('.site-drawer-item')
    const labels = Array.from(items).map((b) => b.textContent)
    expect(labels).toEqual(['Work', 'Writing', 'About', 'Contact'])
  })

  it('navigates when a drawer item is clicked', () => {
    const { container } = render(<SiteHeader />)
    const about = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.site-drawer-item'),
    ).find((b) => b.textContent === 'About')!
    fireEvent.click(about)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/about' })
  })
})
