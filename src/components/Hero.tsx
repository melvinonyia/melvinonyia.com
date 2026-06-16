import { TextArrowCta } from './TextArrowCta'

interface HeroProps {
  headlineText?: string
  heroText?: string
  ctaLabel?: string
  ctaTo?: string
}

const DEFAULT_HEADLINE = 'Melvin Chinedu Onyia'
const DEFAULT_HERO_TEXT =
  'Crafting highly-performant, secure software solutions engineered for scalability and maintainability.'

export function Hero({
  headlineText = DEFAULT_HEADLINE,
  heroText = DEFAULT_HERO_TEXT,
  ctaLabel = 'About me',
  ctaTo = '/about',
}: HeroProps) {
  return (
    <section data-hero>
      <div className="hero-headline" aria-label={headlineText}>
        <h1 className="hero-scroll hero-scroll--first" aria-hidden="true">
          {headlineText}
        </h1>
        <h1 className="hero-scroll hero-scroll--second" aria-hidden="true">
          {headlineText}
        </h1>
      </div>
      <h2 className="hero-text">{heroText}</h2>
      <div className="hero-cta">
        <TextArrowCta to={ctaTo} label={ctaLabel} />
      </div>
    </section>
  )
}
