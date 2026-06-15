import type { ComponentType, ReactNode } from 'react'
import { SiX, SiFacebook } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { SITE_URL } from '~/lib/seo/homeHead'

export interface ArticleDetailData {
  slug: string
  title: string
  subtitle?: string
  date: string
  category?: string
  readTime?: number
  tags: string[]
  coverImage?: string | null
  Body: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

interface ArticleDetailProps {
  data: ArticleDetailData
  basePath: '/writing' | '/work'
  mdxComponents?: Record<string, ComponentType<any>>
  share?: boolean
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return DATE_FORMATTER.format(d)
}

function MetaDot() {
  return <span className="article-detail-meta-dot" aria-hidden="true">•</span>
}

function ShareIcons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const links: { name: string; href: string; Icon: ComponentType }[] = [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: SiX,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
      Icon: FaLinkedinIn,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: SiFacebook,
    },
  ]
  return (
    <div className="article-detail-share">
      <p className="article-detail-share-label">Share</p>
      <ul className="article-detail-share-icons">
        {links.map(({ name, href, Icon }) => (
          <li key={name}>
            <a href={href} target="_blank" rel="noreferrer noopener" aria-label={`Share on ${name}`}>
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ArticleDetail({
  data,
  basePath,
  mdxComponents,
  share = true,
}: ArticleDetailProps) {
  const { Body } = data
  const url = `${SITE_URL}${basePath}/${data.slug}`

  const metaParts: ReactNode[] = []
  metaParts.push(<p key="date">{formatDate(data.date)}</p>)
  if (data.category) {
    metaParts.push(<MetaDot key="dot-cat" />)
    metaParts.push(<p key="cat">{data.category}</p>)
  }
  if (data.readTime) {
    metaParts.push(<MetaDot key="dot-rt" />)
    metaParts.push(<p key="rt">{data.readTime} min read</p>)
  }

  return (
    <article className="article-detail">
      {share && <ShareIcons url={url} title={data.title} />}
      <header className="article-detail-header">
        <h2 className="article-detail-title">{data.title}</h2>
        {data.subtitle && (
          <h2 className="article-detail-subtitle"> {data.subtitle}</h2>
        )}
        <div className="article-detail-meta">{metaParts}</div>
        {data.coverImage && (
          <img
            className="article-detail-hero"
            src={data.coverImage}
            alt={data.title}
          />
        )}
      </header>
      <div className="article-detail-body">
        <Body components={mdxComponents} />
      </div>
      {data.tags.length > 0 && (
        <footer className="article-detail-footer">
          <ul className="article-detail-tags">
            {data.tags.map((tag) => (
              <li key={tag} className="article-detail-tag">
                {tag}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  )
}
