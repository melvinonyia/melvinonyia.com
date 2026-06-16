import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  getCaseStudy,
  getCaseStudySummaries,
  resolveCaseStudy,
  CaseStudyNotFoundError,
} from '~/lib/content/work'
import { CaseStudyView } from '~/components/CaseStudyView'
import { caseStudyPageHead } from '~/lib/seo/caseStudyPageHead'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    try {
      const c = resolveCaseStudy(params.slug)
      const { Body: _Body, ...summary } = c
      void _Body
      const position = getCaseStudySummaries().findIndex((s) => s.slug === params.slug)
      return { summary, position: position >= 0 ? position : 0 }
    } catch (err) {
      if (err instanceof CaseStudyNotFoundError) throw notFound()
      throw err
    }
  },
  head: ({ loaderData }) => (loaderData ? caseStudyPageHead(loaderData.summary) : {}),
  component: CaseStudyPage,
})

function CaseStudyPage() {
  const { summary, position } = Route.useLoaderData()
  const c = getCaseStudy(summary.slug)
  if (!c) throw notFound()
  return <CaseStudyView caseStudy={c} position={position} />
}
