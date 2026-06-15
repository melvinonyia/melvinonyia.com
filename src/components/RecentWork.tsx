import { Link } from '@tanstack/react-router'
import type { WorkPostSummary } from '~/lib/content/work'

interface RecentWorkProps {
  posts: WorkPostSummary[]
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

export function RecentWork({ posts }: RecentWorkProps) {
  if (posts.length === 0) return null
  return (
    <section className="home-articles" aria-label="Recent work">
      <h3 className="home-articles-header">Recent Work</h3>
      <ul className="writing-list">
        {posts.map((post) => (
          <li key={post.slug} className="writing-list-item">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <div>
              <Link
                to="/work/$slug"
                params={{ slug: post.slug }}
                style={{ color: 'inherit' }}
              >
                <h3>{post.title}</h3>
              </Link>
              {post.excerpt && <p>{post.excerpt}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="home-articles-cta">
        <Link to="/work" className="hero-button" aria-label="More Work">
          More Work
        </Link>
      </div>
    </section>
  )
}
