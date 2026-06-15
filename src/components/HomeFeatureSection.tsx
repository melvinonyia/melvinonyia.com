import { Link } from '@tanstack/react-router'
import type { WorkPostSummary } from '~/lib/content/work'
import type { EssaySummary } from '~/lib/content/writing'
import { HoverLift } from './HoverLift'
import { ViewTransitionLink } from './ViewTransitionLink'

interface HomeFeatureSectionProps {
  workPosts: WorkPostSummary[]
  latestEssay: EssaySummary | null
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

function CaseStudyCard({ post }: { post: WorkPostSummary }) {
  return (
    <HoverLift className="h-full">
      <ViewTransitionLink
        to="/work/$slug"
        params={{ slug: post.slug }}
        name={`work-card-${post.slug}`}
        className="group block h-full rounded-md border border-border/40 bg-surface/40 p-6 transition-colors hover:bg-surface/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <time
          dateTime={post.date}
          className="font-mono text-xs uppercase tracking-wide text-muted"
        >
          {formatDate(post.date)}
        </time>
        <h3 className="mt-3 font-sans font-halbfett text-xl sm:text-2xl text-fg">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 font-sans font-buch text-sm text-muted max-w-prose">
            {post.excerpt}
          </p>
        )}
      </ViewTransitionLink>
    </HoverLift>
  )
}

function EssayPreview({ essay }: { essay: EssaySummary }) {
  return (
    <HoverLift>
      <Link
        to="/writing/$slug"
        params={{ slug: essay.slug }}
        className="group block rounded-md border border-border/40 bg-surface/40 p-6 transition-colors hover:bg-surface/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wide text-accent">
            Latest essay
          </span>
          <time
            dateTime={essay.date}
            className="font-mono text-xs uppercase tracking-wide text-muted"
          >
            {formatDate(essay.date)}
          </time>
        </div>
        <h3 className="mt-3 font-sans font-halbfett text-xl sm:text-2xl text-fg">
          {essay.title}
        </h3>
        {essay.excerpt && (
          <p className="mt-3 font-sans font-buch text-sm text-muted max-w-prose">
            {essay.excerpt}
          </p>
        )}
      </Link>
    </HoverLift>
  )
}

export function HomeFeatureSection({
  workPosts,
  latestEssay,
}: HomeFeatureSectionProps) {
  return (
    <section
      aria-label="Selected work and recent writing"
      className="mx-auto mt-12 max-w-5xl pb-32"
    >
      <header className="mb-8 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted">
          Selected work
        </h2>
        <Link
          to="/work"
          className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          All work →
        </Link>
      </header>

      <ul
        data-work-cards
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {workPosts.map((post) => (
          <li key={post.slug} className="h-full">
            <CaseStudyCard post={post} />
          </li>
        ))}
      </ul>

      {latestEssay && (
        <div className="mt-16">
          <header className="mb-8 flex items-baseline justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wide text-muted">
              From the writing
            </h2>
            <Link
              to="/writing"
              className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              All writing →
            </Link>
          </header>
          <EssayPreview essay={latestEssay} />
        </div>
      )}
    </section>
  )
}
