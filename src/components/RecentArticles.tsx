import type { EssaySummary } from '~/lib/content/writing'
import { ArticleList } from './ArticleList'
import { TextArrowCta } from './TextArrowCta'

interface RecentArticlesProps {
  essays: EssaySummary[]
}

function categoryLabel(tags: string[]): string | undefined {
  return tags[0]?.toUpperCase()
}

export function RecentArticles({ essays }: RecentArticlesProps) {
  if (essays.length === 0) return null
  const items = essays.map((essay) => ({
    slug: essay.slug,
    title: essay.title,
    subtitle: essay.excerpt,
    meta: categoryLabel(essay.tags),
    image: essay.coverImage,
  }))
  return (
    <section className="home-strip" aria-label="Recent articles">
      <h3 className="home-strip-header">Recent Articles</h3>
      <ArticleList items={items} to="/writing/$slug" />
      <div className="home-strip-cta">
        <TextArrowCta to="/writing" label="More Articles" />
      </div>
    </section>
  )
}
