const TECHNOLOGIES: readonly string[] = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'GraphQL',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Cloudflare',
  'Redis',
  'GitHub Actions',
]

export function TechnologyGrid() {
  return (
    <ul className="tech-grid" aria-label="Technologies">
      {TECHNOLOGIES.map((name) => (
        <li key={name} className="tech-item">
          {name}
        </li>
      ))}
    </ul>
  )
}
