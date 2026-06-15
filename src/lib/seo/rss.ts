export interface RssChannel {
  siteUrl: string
  feedUrl: string
  title: string
  description: string
  language?: string
}

export interface RssEntry {
  title: string
  link: string
  date: string
  excerpt?: string
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRssDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toUTCString()
}

export function buildRss(channel: RssChannel, entries: RssEntry[]): string {
  const lastBuildDate =
    entries.length > 0 ? toRssDate(entries[0]!.date) : new Date(0).toUTCString()
  const items = entries
    .map((e) => {
      const desc = e.excerpt
        ? `\n      <description>${escapeXml(e.excerpt)}</description>`
        : ''
      return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${escapeXml(e.link)}</link>
      <guid isPermaLink="true">${escapeXml(e.link)}</guid>
      <pubDate>${toRssDate(e.date)}</pubDate>${desc}
    </item>`
    })
    .join('\n')

  const language = channel.language ?? 'en-US'

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.siteUrl)}</link>
    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(channel.description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`
}
