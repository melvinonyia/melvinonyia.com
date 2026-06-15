import { Link } from '@tanstack/react-router'
import type { EssaySummary } from '~/lib/content/writing'

interface RecentArticlesProps {
  essays: EssaySummary[]
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

export function RecentArticles({ essays }: RecentArticlesProps) {
  if (essays.length === 0) return null
  return (
    <section className="home-articles" aria-label="Recent articles">
      <h3 className="home-articles-header">Recent Articles</h3>
      <ul className="writing-list">
        {essays.map((essay) => (
          <li key={essay.slug} className="writing-list-item">
            <time dateTime={essay.date}>{formatDate(essay.date)}</time>
            <div>
              <Link
                to="/writing/$slug"
                params={{ slug: essay.slug }}
                style={{ color: 'inherit' }}
              >
                <h3>{essay.title}</h3>
              </Link>
              {essay.excerpt && <p>{essay.excerpt}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="home-articles-cta">
        <Link to="/writing" className="hero-button" aria-label="More Articles">
          More Articles
        </Link>
      </div>
    </section>
  )
}
