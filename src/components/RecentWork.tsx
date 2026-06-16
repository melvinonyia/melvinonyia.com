import type { WorkPostSummary } from '~/lib/content/work'
import { ArticleList } from './ArticleList'
import { TextArrowCta } from './TextArrowCta'

interface RecentWorkProps {
  posts: WorkPostSummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function RecentWork({ posts }: RecentWorkProps) {
  if (posts.length === 0) return null
  const items = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    subtitle: post.excerpt,
    meta: categoryLabel(post.tags),
    image: post.heroImage,
  }))
  return (
    <section className="home-strip" aria-label="Recent work">
      <h3 className="home-strip-header">Recent Work</h3>
      <ArticleList items={items} to="/work/$slug" />
      <div className="home-strip-cta">
        <TextArrowCta to="/work" label="More Work" />
      </div>
    </section>
  )
}
