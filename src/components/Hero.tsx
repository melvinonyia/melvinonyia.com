import type { ReactNode } from 'react'

interface MetaRow {
  label: string
  value: string
}

interface HeroProps {
  eyebrow?: string
  name?: string
  statement?: ReactNode
  meta?: MetaRow[]
}

const DEFAULT_EYEBROW = 'Staff Software Engineer'
const DEFAULT_NAME = 'Melvin Onyia'
const DEFAULT_STATEMENT: ReactNode = (
  <>
    Backend and infrastructure engineer who also designs and trained in biology. I
    build for the <span className="hero-statement__accent">human</span> side of
    software. The code was never the hard part — understanding the people you build
    for is, and that only gets more valuable.
  </>
)
const DEFAULT_META: MetaRow[] = [
  { label: 'Focus', value: 'Human-facing products' },
  { label: 'Background', value: 'Biology · Design' },
  { label: 'Based', value: 'Remote · US' },
]

export function Hero({
  eyebrow = DEFAULT_EYEBROW,
  name = DEFAULT_NAME,
  statement = DEFAULT_STATEMENT,
  meta = DEFAULT_META,
}: HeroProps) {
  return (
    <section className="hero" data-hero>
      <div className="hero-lede">
        <p className="hero-eyebrow hero-reveal hero-reveal--d1">{eyebrow}</p>
        <h1 className="hero-h1 hero-reveal hero-reveal--d2">{name}</h1>
        <p className="hero-statement hero-reveal hero-reveal--d3">{statement}</p>
      </div>
      <dl className="hero-meta hero-reveal hero-reveal--d4">
        {meta.map((row) => (
          <div className="hero-meta__row" key={row.label}>
            <dt className="hero-meta__k">{row.label}</dt>
            <dd className="hero-meta__v">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
