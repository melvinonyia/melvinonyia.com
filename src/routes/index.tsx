import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'
import { homeHead } from '~/lib/seo/homeHead'

export const Route = createFileRoute('/')({
  head: homeHead,
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <Hero
        name="Melvin Onyia"
        role="Staff Software Engineer"
        pitch="Building software at the intersection of biomechanics and engineering."
      />

      <section
        aria-label="Selected work and recent writing"
        className="mx-auto mt-12 max-w-3xl pb-32"
      >
        <p className="font-mono text-sm text-muted">
          selected work and recent writing — incoming.
        </p>
      </section>
    </main>
  )
}
