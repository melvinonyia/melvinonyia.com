import { createFileRoute } from '@tanstack/react-router'
import { termsHead } from '~/lib/seo/termsHead'

export const Route = createFileRoute('/terms')({
  head: termsHead,
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="legal-container">
      <h2 className="legal-headline">Terms</h2>
      <p>Last updated: January 29, 2022</p>
      <div className="legal-group">
        <p>
          This site is a personal portfolio and writing log maintained by Melvin
          Onyia. Content reflects personal views, not those of any employer.
          You are welcome to read, link to, and quote short excerpts with
          attribution. Reproduction of full pieces, embedded media, or original
          imagery requires written permission.
        </p>
        <p>
          The site is provided as-is, without warranty of any kind. I make no
          guarantee that information here is current, complete, or correct, and
          I am not liable for outcomes from acting on it.
        </p>
      </div>
      <h3>Contact</h3>
      <div className="legal-group">
        <p>
          For takedown requests, licensing, or anything else, write to{' '}
          <a href="mailto:melvin.onyia@gmail.com">melvin.onyia@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}
