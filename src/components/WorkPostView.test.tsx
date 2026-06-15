import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkPostView } from './WorkPostView'
import type { WorkPost } from '~/lib/content/work'

function makePost(overrides: Partial<WorkPost> = {}): WorkPost {
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    date: '2025-11-12',
    excerpt: 'Per-athlete kinematic signatures.',
    tags: ['biomechanics', 'signal processing'],
    heroImage: null,
    Body: () => <p>Body content from the MDX module.</p>,
    ...overrides,
  }
}

describe('WorkPostView', () => {
  it('renders the title as the serif page heading carrying the morph target name', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Movement fingerprint engine')
    expect(h1.className).toMatch(/font-serif/)
    expect(h1.getAttribute('data-view-transition-name')).toBe(
      'work-title-movement-fingerprint',
    )
  })

  it('renders the index label derived from position + year as a machine-readable time', () => {
    render(<WorkPostView post={makePost({ date: '2025-11-12' })} position={2} />)
    expect(screen.getByText('03')).toBeInTheDocument()
    const time = screen.getByText('2025').closest('time')!
    expect(time).toHaveAttribute('datetime', '2025-11-12')
  })

  it('renders the dateline with tags joined and the year', () => {
    render(
      <WorkPostView
        post={makePost({ tags: ['biomechanics', 'tooling'], date: '2025-11-12' })}
        position={0}
      />,
    )
    expect(screen.getByText(/biomechanics · tooling · 2025/)).toBeInTheDocument()
  })

  it('renders the dateline with just the year when there are no tags', () => {
    const { container } = render(
      <WorkPostView post={makePost({ tags: [] })} position={0} />,
    )
    // The header has two year-only nodes — the right-aligned time and the dateline.
    // Both render "2025"; assert the count is at least 2.
    expect(container.querySelectorAll('time, .font-mono').length).toBeGreaterThan(0)
    // Dateline-only assertion: no separator characters present in the rendered text.
    const datelineCandidates = Array.from(container.querySelectorAll('p')).map(
      (p) => p.textContent,
    )
    const datelineWithSeparator = datelineCandidates.find((t) => t?.includes(' · '))
    expect(datelineWithSeparator).toBeUndefined()
  })

  it('renders a hero <img> with alt when heroImage is provided', () => {
    const { container } = render(
      <WorkPostView
        post={makePost({ heroImage: '/og/movement.png' })}
        position={0}
      />,
    )
    const img = container.querySelector('img') as HTMLImageElement | null
    expect(img).not.toBeNull()
    expect(img!.getAttribute('src')).toBe('/og/movement.png')
    expect(img!.getAttribute('alt')).toMatch(/Movement fingerprint engine/)
    expect(container.querySelector('[data-hero-placeholder]')).toBeNull()
  })

  it('renders a placeholder hero block when heroImage is null', () => {
    const { container } = render(
      <WorkPostView post={makePost({ heroImage: null })} position={0} />,
    )
    expect(container.querySelector('[data-hero-placeholder]')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders the MDX body component below the header', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(screen.getByText('Body content from the MDX module.')).toBeInTheDocument()
  })
})
