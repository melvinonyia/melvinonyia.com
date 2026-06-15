import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TechnologyGrid } from './TechnologyGrid'

describe('TechnologyGrid', () => {
  it('renders the technology list with an accessible label', () => {
    render(<TechnologyGrid />)
    const list = screen.getByLabelText('Technologies')
    expect(list).toBeInTheDocument()
  })

  it('lists a handful of representative technologies', () => {
    render(<TechnologyGrid />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('AWS')).toBeInTheDocument()
  })
})
