import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Pullquote } from './Pullquote'

describe('Pullquote', () => {
  it('renders children inside a class-styled blockquote', () => {
    const { container } = render(
      <Pullquote>A line that earns its emphasis.</Pullquote>,
    )
    const quote = container.querySelector('[data-pullquote]')
    expect(quote).not.toBeNull()
    expect(quote!.tagName).toBe('BLOCKQUOTE')
    expect(quote!.className).toMatch(/mdx-pullquote/)
    expect(
      screen.getByText('A line that earns its emphasis.'),
    ).toBeInTheDocument()
  })

  it('renders attribution in the attribution slot when provided', () => {
    render(<Pullquote attribution="Jorge Luis Borges">Words make worlds.</Pullquote>)
    const attribution = screen.getByText(/Jorge Luis Borges/)
    expect(attribution.closest('footer')).not.toBeNull()
    expect(attribution.closest('footer')!.className).toMatch(
      /mdx-pullquote-attribution/,
    )
  })

  it('omits the footer when no attribution is provided', () => {
    const { container } = render(<Pullquote>standalone quote</Pullquote>)
    expect(container.querySelector('footer')).toBeNull()
  })
})
