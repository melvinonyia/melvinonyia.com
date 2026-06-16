import { createFileRoute } from '@tanstack/react-router'
import { getPieceSummaries } from '~/lib/content/writing'
import { WritingIndex } from '~/components/WritingIndex'
import { writingHead } from '~/lib/seo/writingHead'

export const Route = createFileRoute('/writing/')({
  head: writingHead,
  loader: () => ({ pieces: getPieceSummaries() }),
  component: WritingIndexPage,
})

function WritingIndexPage() {
  const { pieces } = Route.useLoaderData()
  return <WritingIndex pieces={pieces} />
}
