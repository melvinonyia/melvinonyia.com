import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { HomeFeatureSection } from '~/components/HomeFeatureSection'
import { homeHead } from '~/lib/seo/homeHead'
import { getWorkPostSummaries } from '~/lib/content/work'

const HOME_WORK_LIMIT = 3

export const Route = createFileRoute('/')({
  head: homeHead,
  loader: () => {
    const workPosts = getWorkPostSummaries().slice(0, HOME_WORK_LIMIT)
    return { workPosts }
  },
  component: HomePage,
})

function HomePage() {
  const { workPosts } = Route.useLoaderData()
  return (
    <main className="min-h-screen px-6">
      <Hero
        name="Melvin Onyia"
        role="Staff Software Engineer"
        pitch="Building software at the intersection of biomechanics and engineering."
      />
      <HomeFeatureSection workPosts={workPosts} />
    </main>
  )
}
