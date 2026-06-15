import { createFileRoute } from '@tanstack/react-router'
import { getWorkPostSummaries } from '~/lib/content/work'
import { WorkIndexView } from '~/components/WorkIndexView'
import { workHead } from '~/lib/seo/workHead'

export const Route = createFileRoute('/work/')({
  head: workHead,
  loader: () => ({ posts: getWorkPostSummaries() }),
  component: WorkIndexPage,
})

function WorkIndexPage() {
  const { posts } = Route.useLoaderData()
  return <WorkIndexView posts={posts} />
}
