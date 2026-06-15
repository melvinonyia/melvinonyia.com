import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/Hero'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6 py-12">
      <Hero
        name="Melvin Onyia"
        pitch="Toolchain online. Real content lands in the next slice."
      />
    </main>
  )
}
