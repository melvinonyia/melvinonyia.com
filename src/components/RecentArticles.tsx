import { Link } from '@tanstack/react-router'
import type { EssaySummary } from '~/lib/content/writing'
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

function Thumb({ src }: { src: string | null | undefined }) {
  return (
    <div className="writing-strip__thumb">
      {src && <img src={src} alt="" loading="lazy" />}
    </div>
  )
}

export function RecentArticles({ essays }: RecentArticlesProps) {
  if (essays.length === 0) return null
  const top = essays.slice(0, 2)
  const rest = essays.slice(2)

  return (
    <section className="writing-strip" aria-label="Recent writing">
      <h2 className="writing-strip__eyebrow">Writing</h2>

      {top.length > 0 && (
        <div className="writing-strip__top">
          {top.map((essay) => (
            <Link
              key={essay.slug}
              to="/writing/$slug"
              params={{ slug: essay.slug }}
              className="writing-strip__card writing-strip__card--top"
              aria-label={essay.title}
            >
              <Thumb src={essay.coverImage} />
              <h3 className="writing-strip__title">{essay.title}</h3>
              {essay.excerpt && (
                <p className="writing-strip__dek">{essay.excerpt}</p>
              )}
              <p className="writing-strip__meta">{metaOf(essay)}</p>
            </Link>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="writing-strip__rest">
          {rest.map((essay) => (
            <Link
              key={essay.slug}
              to="/writing/$slug"
              params={{ slug: essay.slug }}
              className="writing-strip__card writing-strip__card--rest"
              aria-label={essay.title}
            >
              <Thumb src={essay.coverImage} />
              <h3 className="writing-strip__title">{essay.title}</h3>
              <p className="writing-strip__meta">{metaOf(essay)}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="writing-strip__cta">
        <TextArrowCta to="/writing" label="More Articles" />
      </div>
    </section>
  )
}
