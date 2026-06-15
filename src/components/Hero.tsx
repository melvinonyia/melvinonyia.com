import { CursorSpotlight } from './CursorSpotlight'
import { MagneticLink } from './MagneticLink'

interface HeroProps {
  name: string
  role: string
  pitch: string
}

export function Hero({ name, role, pitch }: HeroProps) {
  return (
    <CursorSpotlight>
      <section className="mx-auto max-w-3xl pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-5xl sm:text-6xl lg:text-7xl">
          {name}
        </h1>
        <p className="mt-4 font-sans font-buch text-xl sm:text-2xl text-fg">{role}</p>
        <p className="mt-3 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
          {pitch}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticLink
            to="/work"
            className="inline-flex items-center gap-2 rounded-sm border border-accent/60 px-4 py-2 font-sans font-buch text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            See work →
          </MagneticLink>
          <MagneticLink
            to="/contact"
            className="inline-flex items-center gap-2 rounded-sm border border-border/60 px-4 py-2 font-sans font-buch text-sm text-muted transition-colors hover:text-fg hover:border-border focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Get in touch
          </MagneticLink>
        </div>
      </section>
    </CursorSpotlight>
  )
}
