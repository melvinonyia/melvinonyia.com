import { useEffect, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import {
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiGraphql,
  SiPostgresql,
  SiDocker,
  SiKubernetes,
  SiCloudflare,
  SiGithub,
  SiGithubactions,
  SiRedis,
  SiTerraform,
  SiJest,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

interface Tech {
  name: string
  link: string
  Icon: IconComponent
}

const TECHNOLOGIES: readonly Tech[] = [
  { name: 'TypeScript', link: 'https://www.typescriptlang.org/docs/', Icon: SiTypescript },
  { name: 'React', link: 'https://react.dev/learn', Icon: SiReact },
  { name: 'Next.js', link: 'https://nextjs.org/docs', Icon: SiNextdotjs },
  { name: 'Node.js', link: 'https://nodejs.org/en/docs', Icon: SiNodedotjs },
  { name: 'GraphQL', link: 'https://graphql.org/learn/', Icon: SiGraphql },
  { name: 'PostgreSQL', link: 'https://www.postgresql.org/docs/', Icon: SiPostgresql },
  { name: 'Docker', link: 'https://docs.docker.com/', Icon: SiDocker },
  { name: 'Kubernetes', link: 'https://kubernetes.io/docs/home/', Icon: SiKubernetes },
  { name: 'AWS', link: 'https://docs.aws.amazon.com/', Icon: FaAws },
  { name: 'Cloudflare', link: 'https://developers.cloudflare.com/', Icon: SiCloudflare },
  { name: 'GitHub', link: 'https://docs.github.com/en', Icon: SiGithub },
  { name: 'GitHub Actions', link: 'https://docs.github.com/en/actions', Icon: SiGithubactions },
  { name: 'Redis', link: 'https://redis.io/documentation', Icon: SiRedis },
  { name: 'Terraform', link: 'https://www.terraform.io/docs/index.html', Icon: SiTerraform },
  { name: 'Jest', link: 'https://jestjs.io/docs/en/getting-started', Icon: SiJest },
]

const VISIBLE_COUNT = 6
const SWAP_INTERVAL_MS = 5000
const FADE_DURATION_MS = 1000

export function TechnologyIcons() {
  const [displayed, setDisplayed] = useState<Tech[]>(() =>
    TECHNOLOGIES.slice(0, VISIBLE_COUNT),
  )
  const [hidden, setHidden] = useState<Tech[]>(() =>
    TECHNOLOGIES.slice(VISIBLE_COUNT),
  )
  const [fadingIndex, setFadingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (hidden.length === 0) return
    const interval = setInterval(() => {
      const displayedIndex = Math.floor(Math.random() * displayed.length)
      const hiddenIndex = Math.floor(Math.random() * hidden.length)
      const incoming = hidden[hiddenIndex]
      const outgoing = displayed[displayedIndex]
      if (!incoming || !outgoing) return

      setFadingIndex(displayedIndex)
      const swap = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev]
          next[displayedIndex] = incoming
          return next
        })
        setHidden((prev) => {
          const next = [...prev]
          next[hiddenIndex] = outgoing
          return next
        })
        setFadingIndex(null)
      }, FADE_DURATION_MS)

      return () => clearTimeout(swap)
    }, SWAP_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [displayed, hidden])

  return (
    <div className="tech-icons" aria-label="Technologies">
      <ul className="tech-icons-list">
        {displayed.map((tech, i) => {
          const { Icon, name, link } = tech
          return (
            <li
              key={`${name}-${i}`}
              className={`tech-icon ${
                i === fadingIndex ? 'is-fading-out' : 'is-fading-in'
              }`}
            >
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
