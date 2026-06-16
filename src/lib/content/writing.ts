import type { ComponentType } from 'react'

export interface PieceFrontmatter {
  title: string
  published: string
  dek?: string
  tags?: string[]
  readTime?: number
  leadImage?: string
  ogImage?: string
}

export interface PieceSummary {
  slug: string
  title: string
  published: string
  dek: string
  tags: string[]
  readTime?: number
  leadImage?: string | null
  ogImage: string | null
}

export interface Piece extends PieceSummary {
  Body: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

interface MdxModule {
  frontmatter: PieceFrontmatter
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>
}

const modules = import.meta.glob<MdxModule>('/content/writing/*.mdx', { eager: true })

function slugFromPath(filePath: string): string {
  const match = filePath.match(/\/([^/]+)\.mdx$/)
  if (!match) throw new Error(`Cannot derive slug from path: ${filePath}`)
  return match[1]!
}

function toPiece(filePath: string, mod: MdxModule): Piece {
  return {
    slug: slugFromPath(filePath),
    title: mod.frontmatter.title,
    published: mod.frontmatter.published,
    dek: mod.frontmatter.dek ?? '',
    tags: mod.frontmatter.tags ?? [],
    readTime: mod.frontmatter.readTime,
    leadImage: mod.frontmatter.leadImage ?? null,
    ogImage: mod.frontmatter.ogImage ?? null,
    Body: mod.default,
  }
}

function summarize(piece: Piece): PieceSummary {
  const { Body: _Body, ...summary } = piece
  void _Body
  return summary
}

export function getPieces(): Piece[] {
  return Object.entries(modules)
    .map(([filePath, mod]) => toPiece(filePath, mod))
    .sort((a, b) => (a.published < b.published ? 1 : -1))
}

export function getPiece(slug: string): Piece | null {
  return getPieces().find((p) => p.slug === slug) ?? null
}

export function getPieceSummaries(): PieceSummary[] {
  return getPieces().map(summarize)
}

export class PieceNotFoundError extends Error {
  constructor(public readonly slug: string) {
    super(`Piece not found: ${slug}`)
    this.name = 'PieceNotFoundError'
  }
}

export function resolvePiece(slug: string): Piece {
  const piece = getPiece(slug)
  if (!piece) throw new PieceNotFoundError(slug)
  return piece
}
