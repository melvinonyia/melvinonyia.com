import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HomeContact } from './HomeContact'
import { CONTACT_EMAIL } from '~/lib/site/socials'

describe('HomeContact', () => {
  it('renders the Contact eyebrow and the hook line', () => {
    render(<HomeContact />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(
      screen.getByText(/Building something where the human side matters/),
    ).toBeInTheDocument()
  })

  it('renders the email as a mailto link to CONTACT_EMAIL', () => {
    render(<HomeContact />)
    const email = screen.getByRole('link', { name: new RegExp(CONTACT_EMAIL) })
    expect(email).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`)
  })

  it('renders the availability blurb', () => {
    render(<HomeContact />)
    expect(screen.getByText(/Open to staff & lead roles/)).toBeInTheDocument()
  })
})
