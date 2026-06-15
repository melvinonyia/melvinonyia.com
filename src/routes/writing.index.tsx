import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/writing/')({
  head: () => ({
    meta: [
      { title: 'Writing — Melvin Onyia' },
      {
        name: 'description',
        content: 'Essays from Melvin Onyia. Coming soon.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://melvinonyia.com/writing' }],
  }),
  component: WritingIndexPage,
})

function WritingIndexPage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          Writing
        </h1>
        <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose leading-relaxed">
          Essays soon. Follow along on{' '}
          <a
            href="https://x.com/melvinonyia"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent underline underline-offset-4 hover:text-fg focus-visible:text-fg"
          >
            X
          </a>{' '}
          for now.
        </p>
      </section>
    </main>
  )
}
