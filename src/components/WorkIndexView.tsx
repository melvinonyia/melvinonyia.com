import type { WorkPostSummary } from '~/lib/content/work'
import { HoverLift } from './HoverLift'
import { ViewTransitionLink } from './ViewTransitionLink'

interface WorkIndexViewProps {
  posts: WorkPostSummary[]
}

const monoLabel = 'font-mono text-xs uppercase tracking-wider text-muted'

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

function buildDateline(tags: string[], yr: number | string): string {
  if (tags.length === 0) return `${yr}`
  return `${tags.join(' · ')} · ${yr}`
}

function Spread({ post, position }: { post: WorkPostSummary; position: number }) {
  const morphName = morphNameFor(post.slug)
  const yr = year(post.date)
  const dateline = buildDateline(post.tags, yr)

  return (
    <li>
      <HoverLift>
        <article>
          <ViewTransitionLink
            to="/work/$slug"
            params={{ slug: post.slug }}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {post.heroImage ? (
              <div className="mb-6 sm:mb-8 aspect-[16/9] w-full overflow-hidden border border-border/40">
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
                className="mb-6 sm:mb-8 aspect-[16/9] w-full border border-border/40 bg-surface/40"
              />
            )}
            <div className="flex items-baseline justify-between border-b border-border/40 pb-3">
              <span className={monoLabel}>{indexLabel(position)}</span>
              <span className={monoLabel}>{yr}</span>
            </div>
            <h2
              className="mt-6 font-serif text-fg leading-[0.95] tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                viewTransitionName: morphName,
              }}
              data-view-transition-name={morphName}
            >
              {post.title}
            </h2>
            <p className={`mt-4 ${monoLabel}`}>{dateline}</p>
            {post.excerpt && (
              <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
                {post.excerpt}
              </p>
            )}
          </ViewTransitionLink>
        </article>
      </HoverLift>
    </li>
  )
}

export function WorkIndexView({ posts }: WorkIndexViewProps) {
  return (
    <section className="mx-auto max-w-6xl pt-20 pb-32 sm:pt-28 lg:pt-32">
      <header className="mb-16 sm:mb-20">
        <h1
          className="font-serif text-fg leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          Work
        </h1>
        <p className={`mt-6 ${monoLabel}`}>
          Case studies — biomechanics tooling, movement modeling, lab-to-field systems
        </p>
      </header>

      <ul className="flex flex-col gap-24 sm:gap-32">
        {posts.map((post, i) => (
          <Spread key={post.slug} post={post} position={i} />
        ))}
      </ul>
    </section>
  )
}
