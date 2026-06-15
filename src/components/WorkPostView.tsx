import type { WorkPost } from '~/lib/content/work'

interface WorkPostViewProps {
  post: WorkPost
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

export function WorkPostView({ post }: WorkPostViewProps) {
  const { Body } = post
  return (
    <article className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header
        className="mb-10"
        style={{ viewTransitionName: `work-card-${post.slug}` }}
      >
        <time
          dateTime={post.date}
          className="font-mono text-xs uppercase tracking-wide text-muted"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 font-sans font-buch text-lg sm:text-xl text-muted max-w-prose">
            {post.excerpt}
          </p>
        )}
        {post.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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
