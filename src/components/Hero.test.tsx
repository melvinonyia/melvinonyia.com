import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})
