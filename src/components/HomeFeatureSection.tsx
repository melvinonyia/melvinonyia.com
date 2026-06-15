import { Link } from '@tanstack/react-router'
import type { WorkPostSummary } from '~/lib/content/work'
import { HoverLift } from './HoverLift'
import { ViewTransitionLink } from './ViewTransitionLink'

interface HomeFeatureSectionProps {
  workPosts: WorkPostSummary[]
}

function indexLabel(i: number): string {
  return (i + 1).toString().padStart(2, '0')
}

function year(iso: string): number | string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.getFullYear()
}

function morphNameFor(slug: string): string {
  return `work-title-${slug}`
}

const monoLabel = 'font-mono text-xs uppercase tracking-wider text-muted'

function IndexRow({ post, position }: { post: WorkPostSummary; position: number }) {
  const morphName = morphNameFor(post.slug)
  return (
    <li className="border-b border-border/40 last:border-b-0">
      <HoverLift>
        <ViewTransitionLink
          to="/work/$slug"
          params={{ slug: post.slug }}
          className="grid grid-cols-[2.5rem_1fr_4rem] sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1.4fr)_5rem] items-baseline gap-4 sm:gap-6 py-6 sm:py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className={monoLabel}>{indexLabel(position)}</span>
          <h3
            className="font-serif text-fg text-2xl sm:text-3xl lg:text-4xl tracking-tight"
            style={{ viewTransitionName: morphName }}
            data-view-transition-name={morphName}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p className={`hidden sm:block ${monoLabel} truncate normal-case tracking-wide`}>
              {post.excerpt}
            </p>
          )}
          <span className={`${monoLabel} text-right`}>{year(post.date)}</span>
        </ViewTransitionLink>
      </HoverLift>
    </li>
  )
}

export function HomeFeatureSection({ workPosts }: HomeFeatureSectionProps) {
  return (
    <section
      aria-label="Selected work"
      className="mx-auto max-w-6xl pb-32"
    >
      <header className="mb-2 flex items-baseline justify-between border-b border-border/40 pb-3">
        <h2 className={monoLabel}>Selected work</h2>
        <Link to="/work" className={`${monoLabel} transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}>
          All work →
        </Link>
      </header>
      <ol data-work-cards className="list-none">
        {workPosts.map((post, i) => (
          <IndexRow key={post.slug} post={post} position={i} />
        ))}
      </ol>
    </section>
  )
}
