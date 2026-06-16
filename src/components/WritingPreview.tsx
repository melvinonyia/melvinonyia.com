import type { PieceSummary } from '~/lib/content/writing'
import { Card } from './Card'
import { TextArrowCta } from './TextArrowCta'

interface WritingPreviewProps {
  pieces: PieceSummary[]
}

function yearOf(published: string): string {
  return published.slice(0, 4)
}

function categoryFrom(tag: string): string {
  const text = tag.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function metaOf(piece: PieceSummary): string {
  const parts = [
    piece.tags[0] ? categoryFrom(piece.tags[0]) : null,
    yearOf(piece.published),
    piece.readTime != null ? `${piece.readTime} min read` : null,
  ].filter(Boolean) as string[]
  return parts.join(' · ')
}

export function WritingPreview({ pieces }: WritingPreviewProps) {
  if (pieces.length === 0) return null
  return (
    <section className="writing-preview" aria-label="Recent writing">
      <h2 className="writing-preview__eyebrow">Writing</h2>
      <ul className="card-list">
        {pieces.map((piece) => (
          <li key={piece.slug}>
            <Card
              to="/writing/$slug"
              data={{
                slug: piece.slug,
                title: piece.title,
                dek: piece.dek || undefined,
                meta: metaOf(piece),
                image: piece.leadImage,
              }}
            />
          </li>
        ))}
      </ul>
      <div className="writing-preview__cta">
        <TextArrowCta to="/writing" label="More writing" />
      </div>
    </section>
  )
}
