import { SOCIAL_LINKS, type SocialLink } from '~/lib/site/socials'

interface SocialLinksProps {
  className?: string
}

function Icon({ social }: { social: SocialLink }) {
  switch (social.key) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.29 9.42 7.86 10.96.57.1.78-.25.78-.55v-1.95c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.56-.3-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.48.11-3.08 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.6.24 2.78.12 3.07.74.82 1.18 1.85 1.18 3.11 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55a11.52 11.52 0 0 0 7.85-10.96C23.5 5.65 18.35.5 12 .5z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.659l-5.214-6.817-5.97 6.817H1.673l7.73-8.835L1.25 2.25h6.832l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.084 19.77z" />
        </svg>
      )
  }
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={className ?? 'site-social'}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.key}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
          >
            <Icon social={social} />
          </a>
        </li>
      ))}
    </ul>
  )
}
