import { useNavigate } from '@tanstack/react-router'
import { SocialLinks } from './SocialLinks'

interface SiteFooterProps {
  year: number
}

interface FooterNavColumn {
  title: string
  links: { to: '/about' | '/writing' | '/contact'; text: string }[]
}

const FOOTER_NAV: readonly FooterNavColumn[] = [
  {
    title: 'Profile',
    links: [{ to: '/about', text: 'About' }],
  },
  {
    title: 'Resources',
    links: [{ to: '/writing', text: 'Writing' }],
  },
  {
    title: 'Connect',
    links: [{ to: '/contact', text: 'Contact' }],
  },
]

const TAGLINE = 'Build things, solve problems'
const TITLE = 'Melvin Onyia'

export function SiteFooter({ year }: SiteFooterProps) {
  const navigate = useNavigate()
  return (
    <footer className="site-footer">
      <div className="site-footer-wrapper">
        <div>
          <h4 className="site-footer-tagline">{TAGLINE}</h4>
          <SocialLinks className="site-social" />
        </div>
        <ul className="site-footer-nav">
          {FOOTER_NAV.map(({ title, links }) => (
            <li key={title} className="site-footer-list">
              <span className="site-footer-list-header">{title}</span>
              {links.map(({ to, text }) => (
                <button
                  key={text}
                  type="button"
                  className="site-footer-link"
                  onClick={() => navigate({ to })}
                  aria-label={text}
                >
                  {text}
                </button>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className="site-footer-credit">
        {year} {TITLE} &copy; Copyright -{' '}
        <span
          role="button"
          tabIndex={0}
          className="site-footer-credit-link"
          onClick={() => navigate({ to: '/legal' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate({ to: '/legal' })
          }}
          aria-label="Privacy & Terms"
        >
          Privacy & Terms
        </span>
      </div>
    </footer>
  )
}
