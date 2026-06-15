import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { homeHead } from '~/lib/seo/homeHead'

export const Route = createFileRoute('/')({
  head: homeHead,
  component: HomePage,
})

function HomePage() {
  return <Hero />
}
