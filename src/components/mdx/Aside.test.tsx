import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Aside } from './Aside'

describe('Aside', () => {
  it('renders children inside a semantic aside element', () => {
    const { container } = render(
      <Aside>An aside about the build process.</Aside>,
    )
    const aside = container.querySelector('[data-aside]')
    expect(aside).not.toBeNull()
    expect(aside!.tagName).toBe('ASIDE')
    expect(aside!.className).toMatch(/mdx-aside/)
    expect(
      screen.getByText('An aside about the build process.'),
    ).toBeInTheDocument()
  })

  it('renders the optional label above the content', () => {
    render(<Aside label="Note">Body text.</Aside>)
    const label = screen.getByText('Note')
    expect(label).toBeInTheDocument()
    expect(label.className).toMatch(/mdx-aside-label/)
    expect(screen.getByText('Body text.')).toBeInTheDocument()
  })

  it('omits the label when not provided', () => {
    const { container } = render(<Aside>just body</Aside>)
    expect(container.querySelector('.mdx-aside-label')).toBeNull()
  })
})
