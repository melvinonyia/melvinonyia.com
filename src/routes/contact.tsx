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
      <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          Contact
        </h1>
        <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose leading-relaxed">
          Drop a line below, or email{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline underline-offset-4 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          directly.
        </p>
        <div className="mt-10">
          <ContactForm endpoint="/api/contact" />
        </div>
      </section>
    </main>
  )
}
