import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the name as the page heading in the display serif', () => {
    render(<Hero name="Melvin Onyia" role="Staff Software Engineer" pitch="Building things." />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Melvin Onyia')
    expect(h1.className).toMatch(/font-serif/)
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

  it('does not render a CursorSpotlight wrapper (retired in the redesign)', () => {
    const { container } = render(
      <Hero name="Melvin Onyia" role="Staff Software Engineer" pitch="x" />,
    )
    expect(container.querySelector('[data-cursor-spotlight]')).toBeNull()
  })

  it('does not render hero CTAs (the index is now the work entry point)', () => {
    render(<Hero name="Melvin Onyia" role="Staff Software Engineer" pitch="x" />)
    expect(screen.queryByRole('link', { name: /See work/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /Get in touch/ })).toBeNull()
  })
})
