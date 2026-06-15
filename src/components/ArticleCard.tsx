import { Link } from '@tanstack/react-router'

export interface ArticleCardData {
  slug: string
  title: string
  subtitle?: string
  meta?: string
  image?: string | null
}

interface ArticleCardProps {
  data: ArticleCardData
  to: '/writing/$slug' | '/work/$slug'
}

export function ArticleCard({ data, to }: ArticleCardProps) {
  return (
    <Link
      to={to}
      params={{ slug: data.slug }}
      className="article-card"
      aria-label={data.title}
    >
      <div className="article-card-image">
        {data.image ? (
          <img src={data.image} alt="" loading="lazy" />
        ) : (
          <span className="article-card-placeholder" aria-hidden="true" />
        )}
      </div>
      <h3 className="article-card-title">{data.title}</h3>
      {data.subtitle && (
        <span className="article-card-subtitle">{data.subtitle}</span>
      )}
      {data.meta && <span className="article-card-meta">{data.meta}</span>}
    </Link>
  )
}
