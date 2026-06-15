import type { Essay } from '~/lib/content/writing'
import { Pullquote, Aside } from './mdx'

interface WritingPostViewProps {
  essay: Essay
  essayNumber: number
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return DATE_FORMATTER.format(d)
}

const mdxComponents = { Pullquote, Aside }

export function WritingPostView({ essay }: WritingPostViewProps) {
  const { Body } = essay
  const datelineParts = [
    formatDate(essay.date),
    essay.readTime ? `${essay.readTime} min read` : null,
  ].filter(Boolean) as string[]

  return (
    <article>
      <p className="writing-post-meta">{datelineParts.join(' · ')}</p>
      <h2 className="writing-post-title">{essay.title}</h2>
      <div className="writing-post-body">
        <Body components={mdxComponents} />
      </div>
    </article>
  )
}
