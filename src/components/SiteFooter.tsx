import { SocialLinks } from './SocialLinks'

interface SiteFooterProps {
  year: number
}

export function SiteFooter({ year }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <SocialLinks />

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 font-mono text-xs text-muted">
          <span>© {year} Melvin Onyia</span>
          <a
            href="/legal"
            className="text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Legal
          </a>
        </div>
      </div>
    </footer>
  )
}
