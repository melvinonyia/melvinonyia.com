import { createFileRoute } from '@tanstack/react-router'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '~/lib/site/socials'
import { contactHead } from '~/lib/seo/contactHead'

export const Route = createFileRoute('/contact')({
  head: contactHead,
  component: ContactPage,
})

const LINKEDIN = SOCIAL_LINKS.find((s) => s.key === 'linkedin')

function ContactPage() {
  return (
    <section className="contact-page" aria-label="Contact">
      <p className="contact-page__eyebrow">Contact</p>
      <h1 className="contact-page__title">Get in touch</h1>
      <p className="contact-page__blurb">
        Have a project, a role, or a question worth asking? Email me directly —
        I read everything.
      </p>
      <p className="contact-page__direct">Email</p>
      <a className="contact-page__email" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
        <span className="contact-page__arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <p className="contact-page__secondary">
        Open to staff &amp; lead roles
        {LINKEDIN && (
          <>
            {' · '}
            <a
              href={LINKEDIN.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn ↗
            </a>
          </>
        )}
      </p>
    </section>
  )
}
