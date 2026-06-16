import { CONTACT_EMAIL } from '~/lib/site/socials'

export function HomeContact() {
  return (
    <section className="home-contact" aria-label="Contact">
      <h2 className="home-contact__eyebrow">Contact</h2>
      <p className="home-contact__line">
        Building something where the human side matters?
      </p>
      <a className="home-contact__email" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
        <span className="home-contact__arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <p className="home-contact__avail">Open to staff &amp; lead roles</p>
    </section>
  )
}
