import type { Piece } from '~/lib/content/writing'
import { DetailLayout } from './DetailLayout'
import { Pullquote, Aside } from './mdx'

interface PieceViewProps {
  piece: Piece
  pieceNumber: number
}

const mdxComponents = { Pullquote, Aside }

export function PieceView({ piece }: PieceViewProps) {
  return (
    <DetailLayout
      data={{
        slug: piece.slug,
        title: piece.title,
        dek: piece.dek || undefined,
        published: piece.published,
        category: piece.tags[0],
        readTime: piece.readTime,
        tags: piece.tags,
        leadImage: piece.leadImage,
        Body: piece.Body,
      }}
      basePath="/writing"
      mdxComponents={mdxComponents}
    />
  )
}
