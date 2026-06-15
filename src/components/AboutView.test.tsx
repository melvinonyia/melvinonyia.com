import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AboutView } from './AboutView'

describe('AboutView', () => {
  it('renders the Driven and inspired intro headline', () => {
    render(<AboutView />)
    expect(
      screen.getByText(/Driven and inspired by simple & scalable technical design/),
    ).toBeInTheDocument()
  })

  it('renders the Professional Experience section', () => {
    render(<AboutView />)
    expect(screen.getByText('Professional Experience')).toBeInTheDocument()
    expect(screen.getByText('Cerebral')).toBeInTheDocument()
    expect(screen.getByText('MindPrint')).toBeInTheDocument()
  })

  it('renders the second Building software headline', () => {
    render(<AboutView />)
    expect(
      screen.getByText(/Building software that matters/),
    ).toBeInTheDocument()
  })
})
