import { ArticleCard, type ArticleCardData } from './ArticleCard'

interface ArticleListProps {
  items: ArticleCardData[]
  to: '/writing/$slug' | '/work/$slug'
}

export function ArticleList({ items, to }: ArticleListProps) {
  if (items.length === 0) return null
  return (
    <ul className="article-list">
      {items.map((item) => (
        <li key={item.slug}>
          <ArticleCard data={item} to={to} />
        </li>
      ))}
    </ul>
  )
}
