import type { ComponentType } from 'react'

export interface EssayFrontmatter {
  title: string
  date: string
  excerpt?: string
  tags?: string[]
}

export interface EssaySummary {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export interface Essay extends EssaySummary {
  Body: ComponentType
}

interface MdxModule {
  frontmatter: EssayFrontmatter
  default: ComponentType
}

const modules = import.meta.glob<MdxModule>('/content/writing/*.mdx', { eager: true })

function slugFromPath(filePath: string): string {
  const match = filePath.match(/\/([^/]+)\.mdx$/)
  if (!match) throw new Error(`Cannot derive slug from path: ${filePath}`)
  return match[1]!
}

function toEssay(filePath: string, mod: MdxModule): Essay {
  return {
    slug: slugFromPath(filePath),
    title: mod.frontmatter.title,
    date: mod.frontmatter.date,
    excerpt: mod.frontmatter.excerpt ?? '',
    tags: mod.frontmatter.tags ?? [],
    Body: mod.default,
  }
}

function summarize(essay: Essay): EssaySummary {
  const { Body: _Body, ...summary } = essay
  void _Body
  return summary
}

export function getEssays(): Essay[] {
  return Object.entries(modules)
    .map(([filePath, mod]) => toEssay(filePath, mod))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getEssay(slug: string): Essay | null {
  return getEssays().find((e) => e.slug === slug) ?? null
}

export function getEssaySummaries(): EssaySummary[] {
  return getEssays().map(summarize)
}

export class EssayNotFoundError extends Error {
  constructor(public readonly slug: string) {
    super(`Essay not found: ${slug}`)
    this.name = 'EssayNotFoundError'
  }
}

export function resolveEssay(slug: string): Essay {
  const essay = getEssay(slug)
  if (!essay) throw new EssayNotFoundError(slug)
  return essay
}
