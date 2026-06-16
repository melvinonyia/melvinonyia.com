import { Link } from '@tanstack/react-router'

interface TextArrowCtaProps {
  to: string
  label: string
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function TextArrowCta({ to, label }: TextArrowCtaProps) {
  return (
    <Link to={to} className="text-arrow-cta" aria-label={label}>
      <span
        className="text-arrow-cta__arrow text-arrow-cta__arrow--left"
        aria-hidden="true"
      >
        <Arrow />
      </span>
      <span className="text-arrow-cta__label">{label}</span>
      <span
        className="text-arrow-cta__arrow text-arrow-cta__arrow--right"
        aria-hidden="true"
      >
        <Arrow />
      </span>
      <span
        className="text-arrow-cta__line text-arrow-cta__line--left"
        aria-hidden="true"
      />
      <span
        className="text-arrow-cta__line text-arrow-cta__line--right"
        aria-hidden="true"
      />
    </Link>
  )
}
