import type { PieceSummary } from '~/lib/content/writing'
import { CardList } from './CardList'

interface WritingIndexProps {
  pieces: PieceSummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function WritingIndex({ pieces }: WritingIndexProps) {
  const items = pieces.map((piece) => ({
    slug: piece.slug,
    title: piece.title,
    dek: piece.dek,
    meta: categoryLabel(piece.tags),
    image: piece.leadImage,
  }))
  return (
    <div className="index-page">
      <h2 className="index-page__h">Writing</h2>
      {pieces.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--muted)' }}>
          No pieces yet — check back soon.
        </p>
      ) : (
        <CardList items={items} to="/writing/$slug" />
      )}
    </div>
  )
}
