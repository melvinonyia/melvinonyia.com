import { createFileRoute } from '@tanstack/react-router'
import { CONTACT_EMAIL } from '~/lib/site/socials'
import { ContactForm } from '~/components/ContactForm'
import { contactHead } from '~/lib/seo/contactHead'

export const Route = createFileRoute('/contact')({
  head: contactHead,
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <section className="mx-auto max-w-2xl pt-24 pb-32 sm:pt-32 lg:pt-40">
        <header>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-fg leading-none">
            Contact
          </h1>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
            Drop a line — usually replies inside a day
          </p>
        </header>

        <p className="mt-12 font-sans text-base sm:text-lg text-fg max-w-prose leading-relaxed">
          Use the form below, or email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-4 decoration-muted hover:decoration-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          directly.
        </p>

        <div className="mt-12">
          <ContactForm endpoint="/api/contact" />
        </div>
      </section>
    </main>
  )
}
