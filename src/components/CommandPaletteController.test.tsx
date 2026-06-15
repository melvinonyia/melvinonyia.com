import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { SearchEntry } from '~/lib/search/indexer'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

const FIXTURE: SearchEntry[] = [
  { id: 'route:home', kind: 'route', title: 'Home', to: '/' },
]

vi.mock('~/lib/search/data', () => ({
  getSearchEntries: () => FIXTURE,
}))

beforeEach(() => {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
})

afterEach(() => {
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
  cleanup()
})

import { CommandPaletteController, useOpenCommandPalette } from './CommandPaletteController'

function Opener({ label = 'open' }: { label?: string }) {
  const open = useOpenCommandPalette()
  return (
    <button type="button" onClick={() => open?.()}>
      {label}
    </button>
  )
}

describe('CommandPaletteController', () => {
  it('does not render the palette before it is opened', () => {
    render(
      <CommandPaletteController>
        <Opener />
      </CommandPaletteController>,
    )
    expect(screen.queryByPlaceholderText(/search/i)).toBeNull()
  })

  it('opens the palette when the context trigger is invoked', async () => {
    render(
      <CommandPaletteController>
        <Opener />
      </CommandPaletteController>,
    )
    fireEvent.click(screen.getByText('open'))
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })
  })

  it('opens the palette on Meta+K', async () => {
    render(
      <CommandPaletteController>
        <Opener />
      </CommandPaletteController>,
    )
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })
  })

  it('opens the palette on Ctrl+K', async () => {
    render(
      <CommandPaletteController>
        <Opener />
      </CommandPaletteController>,
    )
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })
  })

  it('Esc closes an open palette', async () => {
    render(
      <CommandPaletteController>
        <Opener />
      </CommandPaletteController>,
    )
    fireEvent.click(screen.getByText('open'))
    const input = await screen.findByPlaceholderText(/search/i)
    fireEvent.keyDown(input, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/search/i)).toBeNull()
    })
  })
})
