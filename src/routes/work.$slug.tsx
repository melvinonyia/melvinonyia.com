import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getWorkPost,
  getWorkPostSummaries,
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
      const position = getWorkPostSummaries().findIndex((p) => p.slug === params.slug)
      return { summary, position: position >= 0 ? position : 0 }
    } catch (err) {
      if (err instanceof WorkNotFoundError) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) => (loaderData ? workPostHead(loaderData.summary) : {}),
  component: WorkPostPage,
})

function WorkPostPage() {
  const { summary, position } = Route.useLoaderData()
  const post = getWorkPost(summary.slug)
  if (!post) throw notFound()
  return <WorkPostView post={post} position={position} />
}
