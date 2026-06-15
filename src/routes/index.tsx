import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { HomeFeatureSection } from '~/components/HomeFeatureSection'
import { homeHead } from '~/lib/seo/homeHead'
import { getWorkPostSummaries } from '~/lib/content/work'
import { getEssaySummaries } from '~/lib/content/writing'

const HOME_WORK_LIMIT = 3

export const Route = createFileRoute('/')({
  head: homeHead,
  loader: () => {
    const workPosts = getWorkPostSummaries().slice(0, HOME_WORK_LIMIT)
    const essays = getEssaySummaries()
    return { workPosts, latestEssay: essays[0] ?? null }
  },
  component: HomePage,
})

function HomePage() {
  const { workPosts, latestEssay } = Route.useLoaderData()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <Hero
        name="Melvin Onyia"
        role="Staff Software Engineer"
        pitch="Building software at the intersection of biomechanics and engineering."
      />
      <HomeFeatureSection workPosts={workPosts} latestEssay={latestEssay} />
    </main>
  )
}
