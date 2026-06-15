import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import appCss from '~/styles/globals.css?url'
import { SiteHeader } from '~/components/SiteHeader'
import { SiteFooter } from '~/components/SiteFooter'
import { CommandPaletteController } from '~/components/CommandPaletteController'
import { NotFoundView } from '~/components/NotFoundView'
import { ServerErrorView } from '~/components/ServerErrorView'
import { RoutePaletteSync } from '~/components/RoutePaletteSync'
import { getPaletteForPath } from '~/lib/site/palette'

const COPYRIGHT_YEAR = 2026

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Melvin Onyia' },
      {
        name: 'description',
        content: 'Melvin Onyia — engineer. Personal site.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preload',
        href: '/fonts/soehne-buch.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/soehne-halbfett.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/berkeley-mono-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/editorial-new-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundView,
  errorComponent: ServerErrorView,
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const palette = getPaletteForPath(pathname)
  return (
    <RootDocument palette={palette}>
      <RoutePaletteSync />
      <CommandPaletteController>
        <SiteHeader />
        <Outlet />
        <SiteFooter year={COPYRIGHT_YEAR} />
      </CommandPaletteController>
      <Analytics />
      <SpeedInsights />
    </RootDocument>
  )
}

function RootDocument({ children, palette }: { children: ReactNode; palette: 'dark' | 'paper' }) {
  return (
    <html lang="en" data-palette={palette}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
