import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  cleanup()
})

import { ContactForm } from './ContactForm'

function fillForm({
  name = 'Sam',
  email = 'sam@example.com',
  message = 'Hello',
}: { name?: string; email?: string; message?: string } = {}) {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } })
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } })
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } })
}

describe('ContactForm', () => {
  it('renders the three visible fields with associated labels', () => {
    render(<ContactForm endpoint="/api/contact" />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders a visually hidden honeypot input', () => {
    const { container } = render(<ContactForm endpoint="/api/contact" />)
    const honeypot = container.querySelector(
      'input[name="company"]',
    ) as HTMLInputElement | null
    expect(honeypot).not.toBeNull()
    expect(honeypot!).toHaveAttribute('tabindex', '-1')
    expect(honeypot!).toHaveAttribute('autocomplete', 'off')
    expect(honeypot!).toHaveAttribute('aria-hidden', 'true')
  })

  it('POSTs the form payload to the configured endpoint on submit', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('/api/contact')
    expect((init as RequestInit).method).toBe('POST')
    const body = JSON.parse(String((init as RequestInit).body))
    expect(body).toEqual({
      name: 'Sam',
      email: 'sam@example.com',
      message: 'Hello',
      honeypot: '',
    })
  })

  it('shows an inline success state and hides the form on a 200 ok', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/thank/i)
    })
    expect(screen.queryByLabelText(/name/i)).toBeNull()
  })

  it('shows a rate-limit error on a 429', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'rate-limit' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/too many/i)
    })
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('shows a validation error on a 400', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'validation' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/check the fields/i)
    })
  })

  it('shows a generic send-failed error on a 502', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'send-failed' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/couldn't send/i)
    })
  })

  it('shows a network error when fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network/i)
    })
  })

  it('disables the submit button while a request is in flight', async () => {
    let resolveFetch!: (r: Response) => void
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((res) => {
          resolveFetch = res
        }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    const button = screen.getByRole('button', { name: /send/i })
    fireEvent.click(button)
    expect(button).toBeDisabled()
    resolveFetch(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  it('refuses to submit when client-side required fields are empty', () => {
    render(<ContactForm endpoint="/api/contact" />)
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('renders labels above their inputs inside the dark form card', () => {
    render(<ContactForm endpoint="/api/contact" />)
    const nameLabel = screen.getByText('Name')
    expect(nameLabel.className).toMatch(/contact-form-label/)
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    expect(nameInput.className).toMatch(/contact-form-input/)
  })

  it('renders the success state with a Thank you heading', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    render(<ContactForm endpoint="/api/contact" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByText('Thank you.')).toBeInTheDocument()
    })
  })
})
