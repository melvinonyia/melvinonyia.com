import { Link } from '@tanstack/react-router'
import { SocialLinks } from './SocialLinks'

export function AboutView() {
  return (
    <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-10">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          About
        </h1>
      </header>

      <div className="font-sans font-buch text-base sm:text-lg text-fg max-w-prose space-y-5 leading-relaxed">
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

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <SocialLinks
          className="flex items-center gap-5"
          labelClassName="font-sans font-buch text-sm text-muted"
        />

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-sm border border-accent/60 px-4 py-2 font-sans font-buch text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span>Get in touch</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
