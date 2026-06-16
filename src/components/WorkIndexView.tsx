import type { WorkPostSummary } from '~/lib/content/work'
import { ArticleList } from './ArticleList'

interface WorkIndexViewProps {
  posts: WorkPostSummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function WorkIndexView({ posts }: WorkIndexViewProps) {
  const items = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    subtitle: post.excerpt,
    meta: categoryLabel(post.tags),
    image: post.heroImage,
  }))
  return (
    <div className="index-page">
      <h2 className="writing-header">Work</h2>
      {posts.length === 0 ? (
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)' }}>
          No projects yet — check back soon.
        </p>
      ) : (
        <ArticleList items={items} to="/work/$slug" />
      )}
    </div>
  )
}
