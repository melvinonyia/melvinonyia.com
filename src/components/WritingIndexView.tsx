import type { EssaySummary } from '~/lib/content/writing'
import { ArticleList } from './ArticleList'

interface WritingIndexViewProps {
  essays: EssaySummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function WritingIndexView({ essays }: WritingIndexViewProps) {
  const items = essays.map((essay) => ({
    slug: essay.slug,
    title: essay.title,
    subtitle: essay.excerpt,
    meta: categoryLabel(essay.tags),
    image: essay.coverImage,
  }))
  return (
    <div>
      <h2 className="writing-header">Blog</h2>
      {essays.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)' }}>
          No essays yet — check back soon.
        </p>
      ) : (
        <ArticleList items={items} to="/writing/$slug" />
      )}
    </div>
  )
}
