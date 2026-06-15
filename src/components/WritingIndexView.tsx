import type { EssaySummary } from '~/lib/content/writing'
import { ViewTransitionLink } from './ViewTransitionLink'
import { HoverLift } from './HoverLift'

interface WritingIndexViewProps {
  essays: EssaySummary[]
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return MONTH_FORMATTER.format(d)
}

function essayYear(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return String(d.getFullYear())
}

function WritingEmptyState() {
  return (
    <div data-empty-state className="mt-12 max-w-prose">
      <p className="font-serif text-4xl sm:text-5xl text-fg leading-tight">
        Issue — in preparation.
      </p>
      <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
        First essay arriving soon. Follow on{' '}
        <a
          href="https://x.com/melvinonyia"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-4 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          X
        </a>
        .
      </p>
    </div>
  )
}

export function WritingIndexView({ essays }: WritingIndexViewProps) {
  return (
    <section className="mx-auto max-w-5xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-16">
        <h1
          className="font-serif text-fg leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          Writing
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
          Essays on movement modeling, biomechanics tooling, and the gap between lab and field.
        </p>
      </header>

      {essays.length === 0 ? (
        <WritingEmptyState />
      ) : (
        <ul className="border-t border-border">
          {essays.map((essay) => (
            <li key={essay.slug} className="border-b border-border">
              <HoverLift>
                <ViewTransitionLink
                  to="/writing/$slug"
                  params={{ slug: essay.slug }}
                  className="block focus:outline-none"
                >
                  <article className="grid grid-cols-[7rem_1fr_4rem] items-baseline gap-6 py-8 sm:py-10">
                    <time
                      dateTime={essay.date}
                      className="font-mono text-xs uppercase tracking-wider text-muted"
                    >
                      {formatDate(essay.date)}
                    </time>
                    <div>
                      <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-fg">
                        {essay.title}
                      </h2>
                      {essay.excerpt && (
                        <p className="mt-3 font-sans font-buch text-base text-muted max-w-prose">
                          {essay.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="justify-self-end font-mono text-xs uppercase tracking-wider text-muted">
                      {essayYear(essay.date)}
                    </span>
                  </article>
                </ViewTransitionLink>
              </HoverLift>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
