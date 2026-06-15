import type { Essay } from '~/lib/content/writing'
import { Pullquote, Aside } from './mdx'

interface WritingPostViewProps {
  essay: Essay
  essayNumber: number
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

const mdxComponents = { Pullquote, Aside }

export function WritingPostView({ essay, essayNumber }: WritingPostViewProps) {
  const { Body } = essay
  const indexLabel = `No. ${String(essayNumber).padStart(2, '0')}`
  const topic = essay.tags[0]?.toUpperCase() ?? null
  const datelineParts = [
    formatDate(essay.date).toUpperCase(),
    essay.readTime ? `${essay.readTime} MIN` : null,
    topic,
  ].filter(Boolean) as string[]

  return (
    <article className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-16">
        <p
          data-essay-number
          className="font-mono text-xs uppercase tracking-wider text-muted"
        >
          {indexLabel}
        </p>
        <h1
          className="mt-4 font-serif text-fg leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          {essay.title}
        </h1>
        <p
          data-dateline
          className="mt-6 font-mono text-xs uppercase tracking-wider text-muted"
        >
          <time dateTime={essay.date}>{formatDate(essay.date).toUpperCase()}</time>
          {datelineParts.slice(1).map((part) => (
            <span key={part}>
              <span aria-hidden="true"> — </span>
              {part}
            </span>
          ))}
        </p>
      </header>

      <div
        data-essay-body
        className="font-sans font-buch text-fg max-w-[68ch] text-lg leading-[1.6] [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:mt-16 [&_h2]:mb-4 [&_h2]:leading-tight [&_p]:mt-6 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-fg"
      >
        <Body components={mdxComponents} />
      </div>
    </article>
  )
}
