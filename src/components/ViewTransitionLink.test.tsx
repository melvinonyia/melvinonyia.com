import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { forwardRef } from 'react'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    {
      to: string
      params?: Record<string, string>
      children: React.ReactNode
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ to, params: _params, children, ...rest }, ref) => {
    void _params
    return (
      <a ref={ref} href={to} {...rest}>
        {children}
      </a>
    )
  }),
  useNavigate: () => navigateMock,
}))

function installMatchMedia(matcher: (q: string) => boolean) {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: matcher(query),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
}

const docAny = document as unknown as { startViewTransition?: unknown }
const ORIGINAL_START_VIEW_TRANSITION = docAny.startViewTransition

function stubStartViewTransition(impl: (cb: () => void | Promise<void>) => unknown) {
  docAny.startViewTransition = vi.fn(impl)
}

function removeStartViewTransition() {
  docAny.startViewTransition = undefined
}

beforeEach(() => {
  installMatchMedia(() => false)
  navigateMock.mockReset()
})

afterEach(() => {
  if (ORIGINAL_START_VIEW_TRANSITION === undefined) {
    removeStartViewTransition()
  } else {
    docAny.startViewTransition = ORIGINAL_START_VIEW_TRANSITION
  }
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
  cleanup()
})

import { ViewTransitionLink } from './ViewTransitionLink'

describe('ViewTransitionLink', () => {
  it('renders children inside an anchor pointing at `to`', () => {
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }}>
        Read foo
      </ViewTransitionLink>,
    )
    expect(screen.getByRole('link', { name: 'Read foo' })).toHaveAttribute(
      'href',
      '/work/$slug',
    )
  })

  it('applies the shared view-transition-name via inline style when `name` is set', () => {
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        x
      </ViewTransitionLink>,
    )
    const link = screen.getByRole('link')
    expect(link.style.viewTransitionName).toBe('work-card-foo')
    expect(link).toHaveAttribute('data-view-transition-name', 'work-card-foo')
  })

  it('omits view-transition-name when `name` is not provided', () => {
    render(<ViewTransitionLink to="/work">All work</ViewTransitionLink>)
    const link = screen.getByRole('link')
    expect(link.style.viewTransitionName).toBe('')
    expect(link).not.toHaveAttribute('data-view-transition-name')
  })

  it('calls document.startViewTransition on click when the API is available', () => {
    stubStartViewTransition((cb) => {
      void cb()
      return { finished: Promise.resolve() }
    })
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        Read foo
      </ViewTransitionLink>,
    )
    const link = screen.getByRole('link')
    fireEvent.click(link)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).toHaveBeenCalledTimes(1)
  })

  it('navigates inside the view-transition callback with {to, params}', () => {
    let captured: (() => void | Promise<void>) | undefined
    stubStartViewTransition((cb) => {
      captured = cb
      return { finished: Promise.resolve() }
    })
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        Read foo
      </ViewTransitionLink>,
    )
    fireEvent.click(screen.getByRole('link'))
    expect(captured).toBeTypeOf('function')
    captured!()
    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/work/$slug', params: { slug: 'foo' } }),
    )
  })

  it('falls back to default navigation when startViewTransition is unavailable', () => {
    removeStartViewTransition()
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        Read foo
      </ViewTransitionLink>,
    )
    const link = screen.getByRole('link')
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(evt)
    expect(evt.defaultPrevented).toBe(false)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('falls back to default navigation when prefers-reduced-motion matches', () => {
    installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    stubStartViewTransition((cb) => {
      void cb()
      return { finished: Promise.resolve() }
    })
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        Read foo
      </ViewTransitionLink>,
    )
    const link = screen.getByRole('link')
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(evt)
    expect(evt.defaultPrevented).toBe(false)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
  })

  it('does not start a view transition on modifier-key clicks (cmd/ctrl/shift/alt)', () => {
    stubStartViewTransition((cb) => {
      void cb()
      return { finished: Promise.resolve() }
    })
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} name="work-card-foo">
        Read foo
      </ViewTransitionLink>,
    )
    const link = screen.getByRole('link')
    fireEvent.click(link, { metaKey: true })
    fireEvent.click(link, { ctrlKey: true })
    fireEvent.click(link, { shiftKey: true })
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
  })

  it('forwards an explicit onClick handler and aborts if it preventDefaults', () => {
    stubStartViewTransition((cb) => {
      void cb()
      return { finished: Promise.resolve() }
    })
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault())
    render(
      <ViewTransitionLink to="/work/$slug" params={{ slug: 'foo' }} onClick={onClick}>
        Read foo
      </ViewTransitionLink>,
    )
    fireEvent.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
    const startVT = docAny.startViewTransition as ReturnType<typeof vi.fn> | undefined
    expect(startVT).not.toHaveBeenCalled()
  })
})
