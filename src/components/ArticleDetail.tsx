import { useState, type ComponentType } from 'react'
import { SiX } from 'react-icons/si'
import { FaLinkedinIn, FaRegCopy, FaCheck } from 'react-icons/fa'
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
  const eu = encodeURIComponent(url)
  const et = encodeURIComponent(title)
  return [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${et}&url=${eu}`,
      Icon: SiX,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${eu}`,
      Icon: FaLinkedinIn,
    },
  ]
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard may be unavailable (e.g. insecure context); ignore silently.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="article-detail-copy"
      aria-label={copied ? 'Link copied' : 'Copy link'}
      aria-live="polite"
    >
      {copied ? <FaCheck /> : <FaRegCopy />}
    </button>
  )
}

function ShareList({ links, url }: { links: ShareLink[]; url: string }) {
  return (
    <ul className="article-detail-share-icons">
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
      <li>
        <CopyLinkButton url={url} />
      </li>
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
      <div className="article-detail-lede">
        <div className="article-detail-lede-inner">
          {data.category && (
            <p className="article-detail-category">{data.category}</p>
          )}
          <h1 className="article-detail-title">{data.title}</h1>
          {data.subtitle && (
            <p className="article-detail-subtitle">{data.subtitle}</p>
          )}
          {data.readTime != null && (
            <p className="article-detail-readtime">{data.readTime} min read</p>
          )}
        </div>
      </div>

      <div className="article-detail-main">
        <aside className="article-detail-share" aria-label="Share on social">
          <p className="article-detail-share-label">Share</p>
          <ShareList links={shareLinks} url={url} />
        </aside>

        <div className="article-detail-content">
          {data.coverImage && (
            <img
              className="article-detail-hero"
              src={data.coverImage}
              alt={data.title}
            />
          )}

          <div className="article-detail-body">
            <Body components={mdxComponents} />
          </div>

          <div className="article-detail-foot">
            <p className="article-detail-updated">
              Last updated: {formatDate(data.date)}
            </p>
            {data.tags.length > 0 && (
              <ul className="article-detail-tags">
                {data.tags.map((tag) => (
                  <li key={tag} className="article-detail-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
