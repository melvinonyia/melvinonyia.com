import type { CaseStudySummary } from '~/lib/content/work'
import { CardList } from './CardList'

interface WorkIndexProps {
  caseStudies: CaseStudySummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function WorkIndex({ caseStudies }: WorkIndexProps) {
  const items = caseStudies.map((c) => ({
    slug: c.slug,
    title: c.title,
    dek: c.dek,
    meta: categoryLabel(c.tags),
    image: c.leadImage,
  }))
  return (
    <div className="index-page">
      <h2 className="index-page__h">Work</h2>
      {caseStudies.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)' }}>
          No case studies yet — check back soon.
        </p>
      ) : (
        <CardList items={items} to="/work/$slug" />
      )}
    </div>
  )
}
