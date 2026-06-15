import { Link } from '@tanstack/react-router'
import { HoverLift } from './HoverLift'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '~/lib/site/socials'

interface AboutLink {
  label: string
  href: string
  external: boolean
}

const ABOUT_LINKS: readonly AboutLink[] = [
  ...SOCIAL_LINKS.map((s) => ({ label: s.label, href: s.href, external: true })),
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}`, external: false },
]

export function AboutView() {
  return (
    <section className="mx-auto max-w-2xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-fg leading-none">
          About
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
          Staff Software Engineer — Currently writing
        </p>
      </header>

      <div className="mt-12 font-sans text-base sm:text-lg text-fg space-y-6 leading-relaxed">
        <p>
          I'm a staff software engineer whose work sits between biomechanics and engineering.
          The questions I'm closest to: how do we model the way an athlete moves, and how do we
          get that model into the hands of the people making decisions about their training and
          recovery.
        </p>
        <p>
          That's meant signal processing on sparse sensor streams, applied ML for movement
          modeling, and the patient API design that lets a sports scientist focus on the question
          they care about, not the plumbing. I care most about the leg between a lab insight and
          someone on the field acting on it.
        </p>
        <p>
          This site is where I publish case studies on that work and the occasional essay on what
          I'm learning.
        </p>
      </div>

      <nav aria-label="Find me elsewhere" className="mt-16">
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-8">
          {ABOUT_LINKS.map((link) => (
            <li key={link.label}>
              <HoverLift className="w-fit">
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="block py-2 pr-4 font-mono text-xs uppercase tracking-wider text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </HoverLift>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-16">
        <Link
          to="/contact"
          className="inline-flex items-baseline gap-3 font-serif text-2xl sm:text-3xl text-fg transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span>Get in touch</span>
          <span aria-hidden="true" className="font-mono text-base">
            →
          </span>
        </Link>
      </div>
    </section>
  )
}
