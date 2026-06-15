import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ComponentType } from 'react'
import { Demo } from './Demo'

type IOCallback = (entries: IntersectionObserverEntry[]) => void

interface MockIO {
  callback: IOCallback
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

const observers: MockIO[] = []

function installMockIO() {
  observers.length = 0
  class FakeIO {
    callback: IOCallback
    observe = vi.fn()
    disconnect = vi.fn()
    unobserve = vi.fn()
    takeRecords = vi.fn(() => [])
    root = null
    rootMargin = ''
    thresholds = []
    constructor(callback: IOCallback) {
      this.callback = callback
      observers.push({
        callback: this.callback,
        observe: this.observe,
        disconnect: this.disconnect,
      })
    }
  }
  ;(globalThis as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver =
    FakeIO as unknown as typeof IntersectionObserver
}

function uninstallIO() {
  delete (globalThis as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver
}

describe('Demo', () => {
  beforeEach(() => {
    uninstallIO()
  })

  afterEach(() => {
    uninstallIO()
  })

  it('renders the placeholder before the inner module mounts', () => {
    installMockIO()
    const load = vi.fn(() => new Promise<{ default: ComponentType }>(() => {}))
    const { container } = render(
      <Demo load={load} caption="My demo" placeholderHeight={200} />,
    )
    const placeholder = container.querySelector('[data-demo-placeholder]')
    expect(placeholder).not.toBeNull()
    expect(placeholder).toHaveTextContent('My demo')
    expect(load).not.toHaveBeenCalled()
  })

  it('reserves the requested height on the wrapping figure', () => {
    installMockIO()
    render(<Demo load={() => new Promise(() => {})} placeholderHeight={420} />)
    const figure = screen.getByRole('region')
    expect(figure).toHaveStyle({ minHeight: '420px' })
  })

  it('mounts the inner component only after the observer reports intersection', async () => {
    installMockIO()
    let resolveLoad!: (mod: { default: ComponentType }) => void
    const loadPromise = new Promise<{ default: ComponentType }>((r) => {
      resolveLoad = r
    })
    render(
      <Demo
        load={() => loadPromise}
        caption="Counter demo"
        placeholderHeight={120}
      />,
    )
    expect(screen.queryByText('inner-ready')).toBeNull()

    act(() => {
      observers[0]!.callback([{ isIntersecting: true } as IntersectionObserverEntry])
    })

    const Inner: ComponentType = () => <div>inner-ready</div>
    await act(async () => {
      resolveLoad({ default: Inner })
      await loadPromise
    })
    await waitFor(() => expect(screen.getByText('inner-ready')).toBeInTheDocument())
    expect(observers[0]!.disconnect).toHaveBeenCalled()
  })

  it('falls back to immediate mount when IntersectionObserver is unavailable', async () => {
    uninstallIO()
    const Inner: ComponentType = () => <div>fallback-inner</div>
    render(<Demo load={() => Promise.resolve({ default: Inner })} caption="x" />)
    await waitFor(() => expect(screen.getByText('fallback-inner')).toBeInTheDocument())
  })

  it('labels the region with the caption for screen readers', () => {
    installMockIO()
    render(
      <Demo
        load={() => new Promise(() => {})}
        caption="Movement counter demo"
      />,
    )
    expect(screen.getByRole('region', { name: 'Movement counter demo' })).toBeInTheDocument()
  })
})
