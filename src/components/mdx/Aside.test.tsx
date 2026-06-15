import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Aside } from './Aside'

describe('Aside', () => {
  it('renders children inside a semantic aside element in mono', () => {
    const { container } = render(<Aside>An aside about gait phase normalization.</Aside>)
    const aside = container.querySelector('[data-aside]')
    expect(aside).not.toBeNull()
    expect(aside!.tagName).toBe('ASIDE')
    expect(aside!.className).toMatch(/font-mono/)
    expect(
      screen.getByText('An aside about gait phase normalization.'),
    ).toBeInTheDocument()
  })

  it('renders the optional label above the content', () => {
    render(<Aside label="Note">Body text.</Aside>)
    expect(screen.getByText('Note')).toBeInTheDocument()
    expect(screen.getByText('Body text.')).toBeInTheDocument()
  })

  it('omits the label when not provided', () => {
    const { container } = render(<Aside>just body</Aside>)
    expect(container.querySelector('p.mb-2')).toBeNull()
  })
})
