import { createFileRoute } from '@tanstack/react-router'
import { Masthead } from '~/components/Masthead'
import { HomeContact } from '~/components/HomeContact'
import { WritingPreview } from '~/components/WritingPreview'
import { WorkPreview } from '~/components/WorkPreview'
import { getPieceSummaries } from '~/lib/content/writing'
import { getFeaturedCaseStudySummaries } from '~/lib/content/work'
import { homeHead } from '~/lib/seo/homeHead'

const HOME_WORK_LIMIT = 3
const HOME_WRITING_LIMIT = 5

export const Route = createFileRoute('/')({
  head: homeHead,
  loader: () => ({
    pieces: getPieceSummaries().slice(0, HOME_WRITING_LIMIT),
    caseStudies: getFeaturedCaseStudySummaries(HOME_WORK_LIMIT),
  }),
  component: HomePage,
})

function HomePage() {
  const { pieces, caseStudies } = Route.useLoaderData()
  return (
    <>
      <Masthead />
      <WorkPreview caseStudies={caseStudies} />
      <WritingPreview pieces={pieces} />
      <HomeContact />
    </>
  )
}
