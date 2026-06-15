import { createFileRoute } from '@tanstack/react-router'
import { getEssaySummaries } from '~/lib/content/writing'
import { WritingIndexView } from '~/components/WritingIndexView'
import { writingHead } from '~/lib/seo/writingHead'

export const Route = createFileRoute('/writing/')({
  head: writingHead,
  loader: () => ({ essays: getEssaySummaries() }),
  component: WritingIndexPage,
})

function WritingIndexPage() {
  const { essays } = Route.useLoaderData()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <WritingIndexView essays={essays} />
    </main>
  )
}
