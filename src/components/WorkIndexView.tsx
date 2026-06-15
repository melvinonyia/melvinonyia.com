import type { WorkPostSummary } from '~/lib/content/work'
import { Link } from '@tanstack/react-router'

interface WorkIndexViewProps {
  posts: WorkPostSummary[]
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return DATE_FORMATTER.format(d)
}

export function WorkIndexView({ posts }: WorkIndexViewProps) {
  return (
    <section className="mx-auto max-w-3xl pt-24 pb-32 sm:pt-32 lg:pt-40">
      <header className="mb-12">
        <h1 className="font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl">
          Work
        </h1>
        <p className="mt-3 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
          Case studies on biomechanics tooling, movement modeling, and the systems that connect
          lab work to performance staff.
        </p>
      </header>

      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <article>
              <Link
                to="/work/$slug"
                params={{ slug: post.slug }}
                className="group block focus:outline-none"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-xs uppercase tracking-wide text-muted"
                >
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-2 font-sans font-halbfett text-2xl sm:text-3xl text-fg group-hover:underline group-focus-visible:underline underline-offset-4">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 font-sans font-buch text-base text-muted max-w-prose">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
