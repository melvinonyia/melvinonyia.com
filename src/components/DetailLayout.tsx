import { useState, type ComponentType } from 'react'
import { SiX } from 'react-icons/si'
import { FaLinkedinIn, FaRegCopy, FaCheck } from 'react-icons/fa'
import { SITE_URL } from '~/lib/seo/homeHead'

export interface DetailLayoutData {
  slug: string
  title: string
  dek?: string
  published: string
  category?: string
  readTime?: number
  tags: string[]
  leadImage?: string | null
  Body: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

interface DetailLayoutProps {
  data: DetailLayoutData
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
      className="detail-layout-copy"
      aria-label={copied ? 'Link copied' : 'Copy link'}
      aria-live="polite"
    >
      {copied ? <FaCheck /> : <FaRegCopy />}
    </button>
  )
}

function ShareList({ links, url }: { links: ShareLink[]; url: string }) {
  return (
    <ul className="detail-layout-share-icons">
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

export function DetailLayout({
  data,
  basePath,
  mdxComponents,
}: DetailLayoutProps) {
  const { Body } = data
  const url = `${SITE_URL}${basePath}/${data.slug}`
  const shareLinks = buildShareLinks(url, data.title)

  return (
    <article className="detail-layout">
      <div className="detail-layout-lede">
        <div className="detail-layout-lede-inner">
          {data.category && (
            <p className="detail-layout-category">{data.category}</p>
          )}
          <h1 className="detail-layout-title">{data.title}</h1>
          {data.dek && <p className="detail-layout-dek">{data.dek}</p>}
          {data.readTime != null && (
            <p className="detail-layout-readtime">{data.readTime} min read</p>
          )}
        </div>
      </div>

      <div className="detail-layout-main">
        <aside className="detail-layout-share" aria-label="Share on social">
          <p className="detail-layout-share-label">Share</p>
          <ShareList links={shareLinks} url={url} />
        </aside>

        <div className="detail-layout-content">
          {data.leadImage && (
            <img
              className="detail-layout-lead"
              src={data.leadImage}
              alt={data.title}
            />
          )}

          <div className="detail-layout-body">
            <Body components={mdxComponents} />
          </div>

          <div className="detail-layout-foot">
            <p className="detail-layout-updated">
              Last updated: {formatDate(data.published)}
            </p>
            {data.tags.length > 0 && (
              <ul className="detail-layout-tags">
                {data.tags.map((tag) => (
                  <li key={tag} className="detail-layout-tag">
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
