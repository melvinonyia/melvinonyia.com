import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WritingPostView } from './WritingPostView'
import type { Essay } from '~/lib/content/writing'

function makeEssay(overrides: Partial<Essay> = {}): Essay {
  return {
    slug: 'the-leg-between-lab-and-field',
    title: 'The leg between lab and field',
    date: '2025-10-08',
    excerpt: 'Most movement-science findings die between publication and practice.',
    tags: ['notes', 'biomechanics'],
    Body: () => <p>Body content from the MDX module.</p>,
    ...overrides,
  }
}

describe('WritingPostView', () => {
  it('renders the title as the page heading in display serif', () => {
    const { container } = render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('The leg between lab and field')
    expect(h1.className).toMatch(/font-serif/)
    expect(container.querySelector('[data-essay-number]')).not.toBeNull()
  })

  it('renders the essay number padded as No. NN', () => {
    const { container } = render(<WritingPostView essay={makeEssay()} essayNumber={3} />)
    const numberEl = container.querySelector('[data-essay-number]')
    expect(numberEl).toHaveTextContent('No. 03')
  })

  it('renders the publication date with a machine-readable datetime', () => {
    render(<WritingPostView essay={makeEssay({ date: '2025-10-08' })} essayNumber={1} />)
    const time = screen.getByText(/October|2025/).closest('time')!
    expect(time).toHaveAttribute('datetime', '2025-10-08')
  })

  it('renders the dateline with date and topic in mono uppercase', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay({ tags: ['biomechanics'] })} essayNumber={1} />,
    )
    const dateline = container.querySelector('[data-dateline]')
    expect(dateline).not.toBeNull()
    expect(dateline!.textContent).toMatch(/BIOMECHANICS/)
    expect(dateline!.className).toMatch(/font-mono/)
  })

  it('includes read time in the dateline when present', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay({ readTime: 5 })} essayNumber={1} />,
    )
    expect(container.querySelector('[data-dateline]')!.textContent).toMatch(/5 MIN/)
  })

  it('omits read time in the dateline when not provided', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay({ readTime: undefined })} essayNumber={1} />,
    )
    expect(container.querySelector('[data-dateline]')!.textContent).not.toMatch(/MIN/)
  })

  it('renders the MDX body component inside a reading-mode container', () => {
    const { container } = render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(screen.getByText('Body content from the MDX module.')).toBeInTheDocument()
    const body = container.querySelector('[data-essay-body]')
    expect(body).not.toBeNull()
    expect(body!.className).toMatch(/max-w-\[68ch\]/)
    expect(body!.className).toMatch(/leading-\[1\.6\]/)
  })

  it('passes Pullquote and Aside as MDX components so essays can use them inline', () => {
    let receivedComponents: Record<string, unknown> | undefined
    const Body: Essay['Body'] = ({ components }) => {
      receivedComponents = components
      return <p>body</p>
    }
    render(<WritingPostView essay={makeEssay({ Body })} essayNumber={1} />)
    expect(receivedComponents).toBeDefined()
    expect(receivedComponents!.Pullquote).toBeDefined()
    expect(receivedComponents!.Aside).toBeDefined()
  })
})
