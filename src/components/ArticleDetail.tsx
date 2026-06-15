import type { ComponentType } from 'react'
import { SiX, SiFacebook } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { SITE_URL } from '~/lib/seo/homeHead'

export interface ArticleDetailData {
  slug: string
  title: string
  subtitle?: string
  date: string
  category?: string
  tags: string[]
  coverImage?: string | null
  Body: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

interface ArticleDetailProps {
  data: ArticleDetailData
  basePath: '/writing' | '/work'
  mdxComponents?: Record<string, ComponentType<any>>
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

interface ShareLink {
  name: string
  href: string
  Icon: ComponentType
}

function buildShareLinks(url: string, title: string): ShareLink[] {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  return [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: SiFacebook,
    },
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
  ]
}

function ShareList({ links }: { links: ShareLink[] }) {
  return (
    <ul>
      {links.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Share on ${name}`}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ArticleDetail({
  data,
  basePath,
  mdxComponents,
}: ArticleDetailProps) {
  const { Body } = data
  const url = `${SITE_URL}${basePath}/${data.slug}`
  const shareLinks = buildShareLinks(url, data.title)

  return (
    <article className="article-detail">
      <div className="article-detail-share" aria-label="Share on social">
        <p className="article-detail-share-label">Share</p>
        <div className="article-detail-share-icons">
          <ShareList links={shareLinks} />
        </div>
      </div>

      <header className="article-detail-header">
        <h2 className="article-detail-title">{data.title}</h2>
        {data.subtitle && (
          <h2 className="article-detail-subtitle"> {data.subtitle}</h2>
        )}
        {data.category && (
          <p className="article-detail-category">{data.category}</p>
        )}
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

      <div className="article-detail-share-mobile article-detail-share-icons">
        <span>Share</span>
        <ShareList links={shareLinks} />
      </div>

      <p className="article-detail-updated">
        Last updated: {formatDate(data.date)}
      </p>

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
