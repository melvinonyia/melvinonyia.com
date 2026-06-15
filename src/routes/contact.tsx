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
    <div className="contact-container">
        <section>
          <h2 className="contact-header">Get in touch</h2>
          <h4 className="contact-text">
            Like what you see? Have a project you would like to talk about? Want
            to ask me a personal question? Fill in the form or drop me an
            email.
          </h4>
          <div className="contact-links">
            <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
              <span>📬</span>
            </a>
            <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
              <span>📞</span>
            </a>
          </div>
        </section>
        <section>
          <ContactForm endpoint="/api/contact" />
        </section>
      </div>
  )
}
