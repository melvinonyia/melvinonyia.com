import type { WorkPost } from '~/lib/content/work'

interface WorkPostViewProps {
  post: WorkPost
  position: number
}

const monoLabel = 'font-mono text-xs uppercase tracking-wider text-muted'

function indexLabel(position: number): string {
  return (position + 1).toString().padStart(2, '0')
}

function morphNameFor(slug: string): string {
  return `work-title-${slug}`
}

function buildDateline(tags: string[], year: number | string): string {
  if (tags.length === 0) return `${year}`
  return `${tags.join(' · ')} · ${year}`
}

export function WorkPostView({ post, position }: WorkPostViewProps) {
  const { Body } = post
  const morphName = morphNameFor(post.slug)
  const yearValue = (() => {
    const d = new Date(post.date)
    return Number.isNaN(d.getTime()) ? post.date : d.getFullYear()
  })()
  const dateline = buildDateline(post.tags, yearValue)

  return (
    <article className="mx-auto max-w-6xl pt-16 pb-32 sm:pt-24 lg:pt-32">
      <header className="mb-12 sm:mb-16">
        <div className="flex items-baseline justify-between border-b border-border/40 pb-3">
          <span className={monoLabel}>{indexLabel(position)}</span>
          <time dateTime={post.date} className={monoLabel}>
            {yearValue}
          </time>
        </div>
        <h1
          className="mt-6 font-serif text-fg leading-[0.92] tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            viewTransitionName: morphName,
          }}
          data-view-transition-name={morphName}
        >
          {post.title}
        </h1>
        <p className={`mt-6 ${monoLabel}`}>{dateline}</p>
        {post.heroImage ? (
          <div className="mt-10 aspect-[16/9] w-full overflow-hidden border border-border/40">
            <img
              src={post.heroImage}
              alt={`${post.title} — case study hero`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            data-hero-placeholder
            className="mt-10 aspect-[16/9] w-full border border-border/40 bg-surface/40"
          />
        )}
        {post.excerpt && (
          <p className="mt-8 font-sans font-buch text-lg sm:text-xl text-muted max-w-prose">
            {post.excerpt}
          </p>
        )}
      </header>

      <div className="mx-auto max-w-prose font-sans font-buch text-fg [&_h2]:font-halbfett [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:mt-4 [&_p]:leading-relaxed">
        <Body />
      </div>
    </article>
  )
}
