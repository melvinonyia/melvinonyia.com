import { Link } from '@tanstack/react-router'
import type { WorkPostSummary } from '~/lib/content/work'

interface WorkIndexViewProps {
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

export function WorkIndexView({ posts }: WorkIndexViewProps) {
  return (
    <div>
      <h2 className="writing-header">Work</h2>

      {posts.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)' }}>
          No projects yet — check back soon.
        </p>
      ) : (
        <ul className="writing-list" style={{ marginTop: '2rem' }}>
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
      )}
    </div>
  )
}
