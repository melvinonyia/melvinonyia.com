import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { TechnologyIcons } from '~/components/TechnologyIcons'
import { RecentArticles } from '~/components/RecentArticles'
import { RecentWork } from '~/components/RecentWork'
import { getEssaySummaries } from '~/lib/content/writing'
import { getWorkPostSummaries } from '~/lib/content/work'
import { homeHead } from '~/lib/seo/homeHead'

const HOME_RECENT_LIMIT = 2

export const Route = createFileRoute('/')({
  head: homeHead,
  loader: () => ({
    essays: getEssaySummaries().slice(0, HOME_RECENT_LIMIT),
    workPosts: getWorkPostSummaries().slice(0, HOME_RECENT_LIMIT),
  }),
  component: HomePage,
})

function HomePage() {
  const { essays, workPosts } = Route.useLoaderData()
  return (
    <>
      <Hero />
      <TechnologyIcons />
      <RecentWork posts={workPosts} />
      <RecentArticles essays={essays} />
    </>
  )
}
