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

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline twice (the two marquee tracks)', () => {
    render(<Hero headlineText="Melvin Chinedu Onyia" heroText="x" />)
    const matches = screen.getAllByText('Melvin Chinedu Onyia')
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the hero text', () => {
    render(
      <Hero
        headlineText="x"
        heroText="Crafting highly-performant, secure software solutions."
      />,
    )
    expect(
      screen.getByText(/Crafting highly-performant, secure software solutions/),
    ).toBeInTheDocument()
  })

  it('renders the About Melvin CTA link', () => {
    render(<Hero headlineText="x" heroText="x" ctaLabel="About Melvin" ctaTo="/about" />)
    const cta = screen.getByRole('link', { name: 'About Melvin' })
    expect(cta).toHaveAttribute('href', '/about')
  })
})
