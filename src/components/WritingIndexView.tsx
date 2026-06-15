import type { EssaySummary } from '~/lib/content/writing'
import { Link } from '@tanstack/react-router'

interface WritingIndexViewProps {
  essays: EssaySummary[]
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return DATE_FORMATTER.format(d)
}

function WritingEmptyState() {
  return (
    <div
      data-empty-state
      className="rounded-md border border-dashed border-border/60 p-8"
    >
      <p className="font-sans font-buch text-base sm:text-lg text-fg">
        Writing soon.
      </p>
      <p className="mt-2 font-sans font-buch text-sm text-muted max-w-prose">
        Follow along on{' '}
        <a
          href="https://x.com/melvinonyia"
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent underline underline-offset-4 hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          X
        </a>{' '}
        until the first essay lands here.
      </p>
    </div>
  )
}

export function WritingIndexView({ essays }: WritingIndexViewProps) {
  return (
    <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-12">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          Writing
        </h1>
        <p className="mt-3 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
          Essays on movement modeling, biomechanics tooling, and the gap between lab work and
          the field.
        </p>
      </header>

      {essays.length === 0 ? (
        <WritingEmptyState />
      ) : (
        <ul className="flex flex-col gap-10">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <article>
                <Link
                  to="/writing/$slug"
                  params={{ slug: essay.slug }}
                  className="group block focus:outline-none"
                >
                  <time
                    dateTime={essay.date}
                    className="font-mono text-xs uppercase tracking-wide text-muted"
                  >
                    {formatDate(essay.date)}
                  </time>
                  <h2 className="mt-2 font-sans font-halbfett text-2xl sm:text-3xl text-fg group-hover:underline group-focus-visible:underline underline-offset-4">
                    {essay.title}
                  </h2>
                  {essay.excerpt && (
                    <p className="mt-2 font-sans font-buch text-base text-muted max-w-prose">
                      {essay.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
