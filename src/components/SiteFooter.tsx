import { Link } from '@tanstack/react-router'
import { SOCIAL_LINKS } from '~/lib/site/socials'

interface SiteFooterProps {
  year: number
}

const NAV_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/writing', label: 'Writing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteFooter({ year }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <span className="site-footer__mark">Melvin Onyia</span>
        <div className="site-footer__links">
          <nav className="site-footer__nav" aria-label="Footer">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
          <nav className="site-footer__social" aria-label="Social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="site-footer__base">
        <span>© {year} Melvin Onyia</span>
        <div className="site-footer__legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
