import { Link } from '@tanstack/react-router'
import type { EssaySummary } from '~/lib/content/writing'

interface WritingIndexViewProps {
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

export function WritingIndexView({ essays }: WritingIndexViewProps) {
  return (
    <div>
      <h2 className="writing-header">Blog</h2>

      {essays.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)' }}>
          No essays yet — check back soon.
        </p>
      ) : (
        <ul className="writing-list" style={{ marginTop: '2rem' }}>
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
      )}
    </div>
  )
}
