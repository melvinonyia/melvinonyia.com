import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getWorkPost,
  resolveWorkPost,
  WorkNotFoundError,
} from '~/lib/content/work'
import { WorkPostView } from '~/components/WorkPostView'
import { workPostHead } from '~/lib/seo/workPostHead'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    try {
      const post = resolveWorkPost(params.slug)
      const { Body: _Body, ...summary } = post
      void _Body
      return { summary }
    } catch (err) {
      if (err instanceof WorkNotFoundError) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) => (loaderData ? workPostHead(loaderData.summary) : {}),
  component: WorkPostPage,
})

function WorkPostPage() {
  const { summary } = Route.useLoaderData()
  const post = getWorkPost(summary.slug)
  if (!post) throw notFound()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <WorkPostView post={post} />
    </main>
  )
}
