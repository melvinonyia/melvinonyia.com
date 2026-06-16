import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { HomeContact } from '~/components/HomeContact'
import { RecentArticles } from '~/components/RecentArticles'
import { RecentWork } from '~/components/RecentWork'
import { getEssaySummaries } from '~/lib/content/writing'
import { getWorkPostSummaries } from '~/lib/content/work'
import { homeHead } from '~/lib/seo/homeHead'

const HOME_WORK_LIMIT = 4
const HOME_WRITING_LIMIT = 5

export const Route = createFileRoute('/')({
  head: homeHead,
  loader: () => ({
    essays: getEssaySummaries().slice(0, HOME_WRITING_LIMIT),
    workPosts: getWorkPostSummaries().slice(0, HOME_WORK_LIMIT),
  }),
  component: HomePage,
})

function HomePage() {
  const { essays, workPosts } = Route.useLoaderData()
  return (
    <>
      <Hero />
      <RecentWork posts={workPosts} />
      <RecentArticles essays={essays} />
      <HomeContact />
    </>
  )
}
