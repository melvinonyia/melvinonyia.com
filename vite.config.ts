/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import path from 'node:path'
import { readdirSync } from 'node:fs'

function discoverContentSlugs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  } catch {
    return []
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
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
})
