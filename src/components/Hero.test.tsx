import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { forwardRef } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ to, children, ...rest }, ref) => (
    <a ref={ref} href={to} {...rest}>
      {children}
    </a>
  )),
}))

beforeEach(() => {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
})

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the name as the page heading', () => {
    render(<Hero name="Melvin Onyia" role="Staff Software Engineer" pitch="Building things." />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Melvin Onyia')
  })

  it('renders the role and pitch as adjacent paragraphs', () => {
    render(
      <Hero
        name="Melvin Onyia"
        role="Staff Software Engineer"
        pitch="Building software at the intersection of biomechanics and engineering."
      />,
    )
    expect(screen.getByText('Staff Software Engineer')).toBeInTheDocument()
    expect(screen.getByText(/biomechanics and engineering/)).toBeInTheDocument()
  })

  it('renders the See work and Get in touch CTAs as links', () => {
    render(
      <Hero name="Melvin Onyia" role="Staff Software Engineer" pitch="x" />,
    )
    expect(screen.getByRole('link', { name: /See work/ })).toHaveAttribute('href', '/work')
    expect(screen.getByRole('link', { name: /Get in touch/ })).toHaveAttribute(
      'href',
      '/contact',
    )
  })
})
