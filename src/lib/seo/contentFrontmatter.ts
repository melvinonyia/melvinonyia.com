import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export interface ContentFrontmatter {
  slug: string
  title?: string
  date?: string
  excerpt?: string
}

function extractFrontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const yaml = match[1] ?? ''
  const out: Record<string, string> = {}
  for (const raw of yaml.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (!m) continue
    const key = m[1]!
    let value = (m[2] ?? '').trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

export function readContentFrontmatter(dir: string): ContentFrontmatter[] {
  let files: string[]
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  } catch {
    return []
  }
  return files
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '')
      const source = readFileSync(path.join(dir, f), 'utf8')
      const fm = extractFrontmatter(source)
      return {
        slug,
        title: fm.title,
        date: fm.date,
        excerpt: fm.excerpt,
      }
    })
    .sort((a, b) => {
      const da = a.date ?? ''
      const db = b.date ?? ''
      return db.localeCompare(da)
    })
}
