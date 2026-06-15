import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getEssay,
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
      return { summary }
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
  const { summary } = Route.useLoaderData()
  const essay = getEssay(summary.slug)
  if (!essay) throw notFound()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <WritingPostView essay={essay} />
    </main>
  )
}
