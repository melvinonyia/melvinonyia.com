import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getPiece,
  getPieces,
  resolvePiece,
  PieceNotFoundError,
} from '~/lib/content/writing'
import { PieceView } from '~/components/PieceView'
import { piecePageHead } from '~/lib/seo/piecePageHead'

export const Route = createFileRoute('/writing/$slug')({
  loader: ({ params }) => {
    try {
      const piece = resolvePiece(params.slug)
      const { Body: _Body, ...summary } = piece
      void _Body
      const pieces = getPieces()
      // Chronological 1-based index: newest piece is No. 01 if you read
      // top-down on /writing, but the editorial "No. NN" reads as a
      // publication sequence — oldest = No. 01, newest gets the highest
      // number. getPieces() returns newest-first; flip to oldest-first
      // before indexing.
      const oldestFirst = [...pieces].reverse()
      const pieceNumber =
        oldestFirst.findIndex((p) => p.slug === piece.slug) + 1
      return { summary, pieceNumber }
    } catch (err) {
      if (err instanceof PieceNotFoundError) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) =>
    loaderData ? piecePageHead(loaderData.summary) : {},
  component: PiecePage,
})

function PiecePage() {
  const { summary, pieceNumber } = Route.useLoaderData()
  const piece = getPiece(summary.slug)
  if (!piece) throw notFound()
  return <PieceView piece={piece} pieceNumber={pieceNumber} />
}
