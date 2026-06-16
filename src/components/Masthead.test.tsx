import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Masthead } from './Masthead'

describe('Masthead', () => {
  it('renders the name as the page h1', () => {
    render(<Masthead name="Melvin Onyia" />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Melvin Onyia' })
    expect(heading).toBeInTheDocument()
  })

  it('renders the eyebrow above the name', () => {
    render(<Masthead eyebrow="Staff Software Engineer" />)
    expect(screen.getByText('Staff Software Engineer')).toBeInTheDocument()
  })

  it('renders the statement paragraph', () => {
    render(<Masthead statement="A short statement about the work." />)
    expect(screen.getByText(/A short statement about the work/)).toBeInTheDocument()
  })

  it('renders each meta row as a dt/dd pair', () => {
    render(
      <Masthead
        meta={[
          { label: 'Focus', value: 'Human-facing products' },
          { label: 'Based', value: 'Remote · US' },
        ]}
      />,
    )
    const focusTerm = screen.getByText('Focus')
    expect(focusTerm.tagName).toBe('DT')
    expect(screen.getByText('Human-facing products').tagName).toBe('DD')
    expect(screen.getByText('Based').tagName).toBe('DT')
    expect(screen.getByText('Remote · US').tagName).toBe('DD')
  })
})
