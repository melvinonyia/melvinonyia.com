import { createFileRoute } from '@tanstack/react-router'
import { legalHead } from '~/lib/seo/legalHead'

export const Route = createFileRoute('/legal')({
  head: legalHead,
  component: LegalPage,
})

function LegalPage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          Legal
        </h1>
        <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose leading-relaxed">
          Content on melvinonyia.com belongs to Melvin Onyia unless attributed otherwise.
          For takedown requests, licensing, or anything else, write to{' '}
          <a
            href="mailto:melvin.onyia@gmail.com"
            className="text-accent underline underline-offset-4 hover:text-fg focus-visible:text-fg"
          >
            melvin.onyia@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}
