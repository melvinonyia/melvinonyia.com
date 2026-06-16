import { Card, type CardData } from './Card'

interface CardListProps {
  items: CardData[]
  to: '/writing/$slug' | '/work/$slug'
}

export function CardList({ items, to }: CardListProps) {
  if (items.length === 0) return null
  return (
    <ul className="card-list">
      {items.map((item) => (
        <li key={item.slug}>
          <Card data={item} to={to} />
        </li>
      ))}
    </ul>
  )
}
