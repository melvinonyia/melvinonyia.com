import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getEssay,
  getEssays,
  resolveEssay,
  EssayNotFoundError,
} from '~/lib/content/writing'
import { WritingPostView } from '~/components/WritingPostView'
import { writingPostHead } from '~/lib/seo/writingPostHead'

export const Route = createFileRoute('/writing/$slug')({
  loader: ({ params }) => {
    try {
      const essay = resolveEssay(params.slug)
      const { Body: _Body, ...summary } = essay
      void _Body
      const essays = getEssays()
      // Chronological 1-based index: newest essay is No. 01 if you read
      // top-down on /writing, but the editorial "No. NN" reads as a
      // publication sequence — oldest = No. 01, newest gets the highest
      // number. getEssays() returns newest-first; flip to oldest-first
      // before indexing.
      const oldestFirst = [...essays].reverse()
      const essayNumber =
        oldestFirst.findIndex((e) => e.slug === essay.slug) + 1
      return { summary, essayNumber }
    } catch (err) {
      if (err instanceof EssayNotFoundError) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) =>
    loaderData ? writingPostHead(loaderData.summary) : {},
  component: WritingPostPage,
})

function WritingPostPage() {
  const { summary, essayNumber } = Route.useLoaderData()
  const essay = getEssay(summary.slug)
  if (!essay) throw notFound()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <WritingPostView essay={essay} essayNumber={essayNumber} />
    </main>
  )
}
