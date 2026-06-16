import { createFileRoute } from '@tanstack/react-router'
import { getCaseStudySummaries } from '~/lib/content/work'
import { WorkIndex } from '~/components/WorkIndex'
import { workHead } from '~/lib/seo/workHead'

export const Route = createFileRoute('/work/')({
  head: workHead,
  loader: () => ({ caseStudies: getCaseStudySummaries() }),
  component: WorkIndexPage,
})

function WorkIndexPage() {
  const { caseStudies } = Route.useLoaderData()
  return <WorkIndex caseStudies={caseStudies} />
}
