import { Link } from '@tanstack/react-router'
import type { WorkPostSummary } from '~/lib/content/work'
import { TextArrowCta } from './TextArrowCta'

interface RecentWorkProps {
  posts: WorkPostSummary[]
}

function yearOf(date: string): string {
  return date.slice(0, 4)
}

function stackOf(tags: string[]): string {
  return tags.join(' · ')
}

export function RecentWork({ posts }: RecentWorkProps) {
  if (posts.length === 0) return null
  return (
    <section className="work-index" aria-label="Recent work">
      <h2 className="work-index__eyebrow">Selected work</h2>
      {posts.map((post) => (
        <Link
          key={post.slug}
          to="/work/$slug"
          params={{ slug: post.slug }}
          className="work-index__row"
          aria-label={post.title}
        >
          <div className="work-index__main">
            <h3 className="work-index__title">
              <span>{post.title}</span>
              <span className="work-index__arrow" aria-hidden="true">
                →
              </span>
            </h3>
            {post.excerpt && <p className="work-index__desc">{post.excerpt}</p>}
          </div>
          <div className="work-index__meta">
            <span className="work-index__year">{yearOf(post.date)}</span>
            {post.tags.length > 0 && (
              <span className="work-index__stack">{stackOf(post.tags)}</span>
            )}
          </div>
        </Link>
      ))}
      <div className="work-index__cta">
        <TextArrowCta to="/work" label="More Work" />
      </div>
    </section>
  )
}
