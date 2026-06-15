import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TechnologyIcons } from './TechnologyIcons'

function hrefSnapshot() {
  return Array.from(
    screen.getByLabelText('Technologies').querySelectorAll('a'),
  ).map((a) => a.getAttribute('href'))
}

describe('TechnologyIcons', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders six icons initially', () => {
    render(<TechnologyIcons />)
    const list = screen.getByLabelText('Technologies').querySelector('ul')!
    expect(list.children.length).toBe(6)
  })

  it('renders each icon as an external link with an aria-label', () => {
    render(<TechnologyIcons />)
    const links = screen.getByLabelText('Technologies').querySelectorAll('a')
    expect(links.length).toBe(6)
    links.forEach((a) => {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noreferrer noopener')
      expect(a.getAttribute('aria-label')).toBeTruthy()
    })
  })

  it('swaps an icon after the rotation interval fires', () => {
    render(<TechnologyIcons />)
    const initial = hrefSnapshot()
    act(() => {
      vi.advanceTimersByTime(5_000)
      vi.advanceTimersByTime(1_000)
    })
    const next = hrefSnapshot()
    const changed = initial.some((href, i) => href !== next[i])
    expect(changed).toBe(true)
  })
})
