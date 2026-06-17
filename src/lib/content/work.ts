import type { ComponentType } from 'react'

export interface CaseStudyFrontmatter {
  title: string
  published: string
  dek?: string
  tags?: string[]
  leadImage?: string
  ogImage?: string
  featured?: boolean
}

export interface CaseStudySummary {
  slug: string
  title: string
  published: string
  dek: string
  tags: string[]
  leadImage: string | null
  ogImage: string | null
  featured: boolean
}

export interface CaseStudy extends CaseStudySummary {
  Body: ComponentType
}

function summarize(c: CaseStudy): CaseStudySummary {
  const { Body: _Body, ...summary } = c
  void _Body
  return summary
}

export function getCaseStudySummaries(): CaseStudySummary[] {
  return getCaseStudies().map(summarize)
}

export function getCaseStudySummary(slug: string): CaseStudySummary | null {
  const c = getCaseStudy(slug)
  return c ? summarize(c) : null
}

/**
 * Case studies flagged `featured: true` in frontmatter, reverse-chronological.
 * Used to curate the home page; pass a limit to show only the latest few.
 */
export function getFeaturedCaseStudySummaries(limit?: number): CaseStudySummary[] {
  const featured = getCaseStudySummaries().filter((c) => c.featured)
  return limit === undefined ? featured : featured.slice(0, limit)
}

interface MdxModule {
  frontmatter: CaseStudyFrontmatter
  default: ComponentType
}

const modules = import.meta.glob<MdxModule>('/content/work/*.mdx', { eager: true })

function slugFromPath(filePath: string): string {
  const match = filePath.match(/\/([^/]+)\.mdx$/)
  if (!match) throw new Error(`Cannot derive slug from path: ${filePath}`)
  return match[1]!
}

function toCaseStudy(filePath: string, mod: MdxModule): CaseStudy {
  return {
    slug: slugFromPath(filePath),
    title: mod.frontmatter.title,
    published: mod.frontmatter.published,
    dek: mod.frontmatter.dek ?? '',
    tags: mod.frontmatter.tags ?? [],
    leadImage: mod.frontmatter.leadImage ?? null,
    ogImage: mod.frontmatter.ogImage ?? null,
    featured: mod.frontmatter.featured ?? false,
    Body: mod.default,
  }
}

export function getCaseStudies(): CaseStudy[] {
  return Object.entries(modules)
    .map(([filePath, mod]) => toCaseStudy(filePath, mod))
    .sort((a, b) => (a.published < b.published ? 1 : -1))
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return getCaseStudies().find((c) => c.slug === slug) ?? null
}

export class CaseStudyNotFoundError extends Error {
  constructor(public readonly slug: string) {
    super(`Case study not found: ${slug}`)
    this.name = 'CaseStudyNotFoundError'
  }
}

export function resolveCaseStudy(slug: string): CaseStudy {
  const c = getCaseStudy(slug)
  if (!c) throw new CaseStudyNotFoundError(slug)
  return c
}
