import type { EssaySummary } from '~/lib/content/writing'
import { ArticleCard } from './ArticleCard'
import { TextArrowCta } from './TextArrowCta'

interface RecentArticlesProps {
  essays: EssaySummary[]
}

function yearOf(date: string): string {
  return date.slice(0, 4)
}

function categoryFrom(tag: string): string {
  const text = tag.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function metaOf(essay: EssaySummary): string {
  const parts = [
    essay.tags[0] ? categoryFrom(essay.tags[0]) : null,
    yearOf(essay.date),
    essay.readTime != null ? `${essay.readTime} min read` : null,
  ].filter(Boolean) as string[]
  return parts.join(' · ')
}

export function RecentArticles({ essays }: RecentArticlesProps) {
  if (essays.length === 0) return null
  return (
    <section className="writing-strip" aria-label="Recent writing">
      <h2 className="writing-strip__eyebrow">Writing</h2>
      <ul className="article-list">
        {essays.map((essay) => (
          <li key={essay.slug}>
            <ArticleCard
              to="/writing/$slug"
              data={{
                slug: essay.slug,
                title: essay.title,
                subtitle: essay.excerpt || undefined,
                meta: metaOf(essay),
                image: essay.coverImage,
              }}
            />
          </li>
        ))}
      </ul>
      <div className="writing-strip__cta">
        <TextArrowCta to="/writing" label="More Articles" />
      </div>
    </section>
  )
}
