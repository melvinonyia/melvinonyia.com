/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import path from 'node:path'
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { buildSitemap } from './src/lib/seo/sitemap'
import { buildRss } from './src/lib/seo/rss'
import { readContentFrontmatter } from './src/lib/seo/contentFrontmatter'

const SITE_URL = 'https://melvinonyia.com'
const STATIC_SITEMAP_ROUTES = ['/', '/about', '/contact', '/work', '/writing']

function discoverContentSlugs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

function emitSeoArtifactsPlugin(): Plugin {
  return {
    name: 'emit-seo-artifacts',
    apply: 'build',
    closeBundle: {
      sequential: true,
      handler() {
        const outDir = path.resolve(__dirname, './dist/client')
        try {
          mkdirSync(outDir, { recursive: true })
        } catch {
          // already exists
        }

        const work = readContentFrontmatter(path.resolve(__dirname, './content/work'))
        const essays = readContentFrontmatter(
          path.resolve(__dirname, './content/writing'),
        )

        const sitemapEntries = [
          ...STATIC_SITEMAP_ROUTES.map((p) => ({ loc: `${SITE_URL}${p}` })),
          ...work.map((w) => ({
            loc: `${SITE_URL}/work/${w.slug}`,
            lastmod: w.date,
          })),
          ...essays.map((e) => ({
            loc: `${SITE_URL}/writing/${e.slug}`,
            lastmod: e.date,
          })),
        ]
        writeFileSync(
          path.join(outDir, 'sitemap.xml'),
          buildSitemap(sitemapEntries),
          'utf8',
        )

        const rssXml = buildRss(
          {
            siteUrl: SITE_URL,
            feedUrl: `${SITE_URL}/rss.xml`,
            title: 'Melvin Onyia — Writing',
            description:
              'Essays on biomechanics, performance, and the systems that connect lab work to the field.',
            language: 'en-US',
          },
          essays.map((e) => ({
            title: e.title ?? e.slug,
            link: `${SITE_URL}/writing/${e.slug}`,
            date: e.date ?? '',
            excerpt: e.excerpt,
          })),
        )
        writeFileSync(path.join(outDir, 'rss.xml'), rssXml, 'utf8')
      },
    },
  }
}

const workPrerenderPages = discoverContentSlugs(
  path.resolve(__dirname, './content/work'),
).map((slug) => ({
  path: `/work/${slug}`,
  prerender: { enabled: true },
}))

const writingPrerenderPages = discoverContentSlugs(
  path.resolve(__dirname, './content/writing'),
).map((slug) => ({
  path: `/writing/${slug}`,
  prerender: { enabled: true },
}))

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        providerImportSource: undefined,
      }),
    },
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tanstackStart({
      pages: [
        { path: '/', prerender: { enabled: true } },
        { path: '/about', prerender: { enabled: true } },
        { path: '/contact', prerender: { enabled: true } },
        { path: '/writing', prerender: { enabled: true } },
        { path: '/legal', prerender: { enabled: true } },
        { path: '/work', prerender: { enabled: true } },
        ...workPrerenderPages,
        ...writingPrerenderPages,
      ],
    }),
    react(),
    tailwindcss(),
    emitSeoArtifactsPlugin(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
})
