import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import appCss from '~/styles/globals.css?url'
import { SiteHeader } from '~/components/SiteHeader'
import { SiteFooter } from '~/components/SiteFooter'
import { CommandPaletteController } from '~/components/CommandPaletteController'
import { NotFoundView } from '~/components/NotFoundView'
import { ServerErrorView } from '~/components/ServerErrorView'

const COPYRIGHT_YEAR = 2026

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Melvin Onyia' },
      {
        name: 'description',
        content: 'Melvin Onyia — software engineer. Build things, solve problems.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundView,
  errorComponent: ServerErrorView,
})

function RootComponent() {
  return (
    <RootDocument>
      <CommandPaletteController>
        <div className="site-container">
          <SiteHeader />
          <main>
            <Outlet />
          </main>
          <SiteFooter year={COPYRIGHT_YEAR} />
        </div>
      </CommandPaletteController>
      <Analytics />
      <SpeedInsights />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
