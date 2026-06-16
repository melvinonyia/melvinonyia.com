import type { ReactNode } from 'react'

interface MetaRow {
  label: string
  value: string
}

interface MastheadProps {
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
    build for the <span className="masthead-statement__accent">human</span> side of
    software. The code was never the hard part — understanding the people you build
    for is, and that only gets more valuable.
  </>
)
const DEFAULT_META: MetaRow[] = [
  { label: 'Focus', value: 'Human-facing products' },
  { label: 'Background', value: 'Biology · Design' },
  { label: 'Based', value: 'Remote · US' },
]

export function Masthead({
  eyebrow = DEFAULT_EYEBROW,
  name = DEFAULT_NAME,
  statement = DEFAULT_STATEMENT,
  meta = DEFAULT_META,
}: MastheadProps) {
  return (
    <section className="masthead" data-masthead>
      <div className="masthead-lede">
        <p className="masthead-eyebrow masthead-reveal masthead-reveal--d1">{eyebrow}</p>
        <h1 className="masthead-h1 masthead-reveal masthead-reveal--d2">{name}</h1>
        <p className="masthead-statement masthead-reveal masthead-reveal--d3">{statement}</p>
      </div>
      <dl className="masthead-meta masthead-reveal masthead-reveal--d4">
        {meta.map((row) => (
          <div className="masthead-meta__row" key={row.label}>
            <dt className="masthead-meta__k">{row.label}</dt>
            <dd className="masthead-meta__v">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
