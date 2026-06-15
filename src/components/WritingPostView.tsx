import type { Essay } from '~/lib/content/writing'

interface WritingPostViewProps {
  essay: Essay
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return DATE_FORMATTER.format(d)
}

export function WritingPostView({ essay }: WritingPostViewProps) {
  const { Body } = essay
  return (
    <article className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-10">
        <time
          dateTime={essay.date}
          className="font-mono text-xs uppercase tracking-wide text-muted"
        >
          {formatDate(essay.date)}
        </time>
        <h1 className="mt-3 font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl lg:text-6xl">
          {essay.title}
        </h1>
        {essay.excerpt && (
          <p className="mt-4 font-sans font-buch text-lg sm:text-xl text-muted max-w-prose">
            {essay.excerpt}
          </p>
        )}
        {essay.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {essay.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-xs uppercase tracking-wide text-muted border border-muted/30 rounded-full px-2 py-0.5"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="prose-body font-sans font-buch text-fg max-w-prose [&_h2]:font-halbfett [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:mt-4 [&_p]:leading-relaxed">
        <Body />
      </div>
    </article>
  )
}
