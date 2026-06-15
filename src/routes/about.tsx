import { createFileRoute } from '@tanstack/react-router'
import { AboutView } from '~/components/AboutView'
import { aboutHead } from '~/lib/seo/aboutHead'

export const Route = createFileRoute('/about')({
  head: aboutHead,
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <AboutView />
    </main>
  )
}
