import type { ComponentType } from 'react'

export interface WorkFrontmatter {
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  heroImage?: string
}

export interface WorkPostSummary {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  heroImage: string | null
}

export interface WorkPost extends WorkPostSummary {
  Body: ComponentType
}

function summarize(post: WorkPost): WorkPostSummary {
  const { Body: _Body, ...summary } = post
  void _Body
  return summary
}

export function getWorkPostSummaries(): WorkPostSummary[] {
  return getWorkPosts().map(summarize)
}

export function getWorkPostSummary(slug: string): WorkPostSummary | null {
  const post = getWorkPost(slug)
  return post ? summarize(post) : null
}

interface MdxModule {
  frontmatter: WorkFrontmatter
  default: ComponentType
}

const modules = import.meta.glob<MdxModule>('/content/work/*.mdx', { eager: true })

function slugFromPath(filePath: string): string {
  const match = filePath.match(/\/([^/]+)\.mdx$/)
  if (!match) throw new Error(`Cannot derive slug from path: ${filePath}`)
  return match[1]!
}

function toWorkPost(filePath: string, mod: MdxModule): WorkPost {
  return {
    slug: slugFromPath(filePath),
    title: mod.frontmatter.title,
    date: mod.frontmatter.date,
    excerpt: mod.frontmatter.excerpt ?? '',
    tags: mod.frontmatter.tags ?? [],
    heroImage: mod.frontmatter.heroImage ?? null,
    Body: mod.default,
  }
}

export function getWorkPosts(): WorkPost[] {
  return Object.entries(modules)
    .map(([filePath, mod]) => toWorkPost(filePath, mod))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getWorkPost(slug: string): WorkPost | null {
  return getWorkPosts().find((p) => p.slug === slug) ?? null
}

export class WorkNotFoundError extends Error {
  constructor(public readonly slug: string) {
    super(`Work post not found: ${slug}`)
    this.name = 'WorkNotFoundError'
  }
}

export function resolveWorkPost(slug: string): WorkPost {
  const post = getWorkPost(slug)
  if (!post) throw new WorkNotFoundError(slug)
  return post
}
