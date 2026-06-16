import { Link } from '@tanstack/react-router'

export interface CardData {
  slug: string
  title: string
  dek?: string
  meta?: string
  image?: string | null
}

interface CardProps {
  data: CardData
  to: '/writing/$slug' | '/work/$slug'
}

export function Card({ data, to }: CardProps) {
  return (
    <Link
      to={to}
      params={{ slug: data.slug }}
      className="card"
      aria-label={data.title}
    >
      <div className="card-image">
        {data.image ? (
          <img src={data.image} alt="" loading="lazy" />
        ) : (
          <span className="card-placeholder" aria-hidden="true" />
        )}
      </div>
      <h3 className="card-title">{data.title}</h3>
      {data.dek && <span className="card-dek">{data.dek}</span>}
      {data.meta && <span className="card-meta">{data.meta}</span>}
    </Link>
  )
}
