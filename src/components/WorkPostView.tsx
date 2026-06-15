import type { WorkPost } from '~/lib/content/work'

interface WorkPostViewProps {
  post: WorkPost
  position: number
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

export function WorkPostView({ post }: WorkPostViewProps) {
  const { Body } = post
  const dateline = [formatDate(post.date), ...(post.tags ?? [])].join(' · ')

  return (
    <article>
      <p className="writing-post-meta">{dateline}</p>
      <h2 className="writing-post-title">{post.title}</h2>
      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={`${post.title} — case study`}
          style={{
            display: 'block',
            margin: '2rem 0',
            width: '100%',
            border: '1px solid rgb(64 64 64)',
          }}
        />
      )}
      <div className="writing-post-body">
        <Body />
      </div>
    </article>
  )
}
