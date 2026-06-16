import { Link } from '@tanstack/react-router'
import type { CaseStudySummary } from '~/lib/content/work'
import { TextArrowCta } from './TextArrowCta'

interface WorkPreviewProps {
  caseStudies: CaseStudySummary[]
}

function yearOf(published: string): string {
  return published.slice(0, 4)
}

function stackOf(tags: string[]): string {
  return tags.join(' · ')
}

export function WorkPreview({ caseStudies }: WorkPreviewProps) {
  if (caseStudies.length === 0) return null
  return (
    <section className="work-preview" aria-label="Recent work">
      <h2 className="work-preview__eyebrow">Selected work</h2>
      {caseStudies.map((c) => (
        <Link
          key={c.slug}
          to="/work/$slug"
          params={{ slug: c.slug }}
          className="work-preview__row"
          aria-label={c.title}
        >
          <div className="work-preview__main">
            <h3 className="work-preview__title">
              <span>{c.title}</span>
              <span className="work-preview__arrow" aria-hidden="true">
                →
              </span>
            </h3>
            {c.dek && <p className="work-preview__desc">{c.dek}</p>}
          </div>
          <div className="work-preview__meta">
            <span className="work-preview__year">{yearOf(c.published)}</span>
            {c.tags.length > 0 && (
              <span className="work-preview__stack">{stackOf(c.tags)}</span>
            )}
          </div>
        </Link>
      ))}
      <div className="work-preview__cta">
        <TextArrowCta to="/work" label="More Work" />
      </div>
    </section>
  )
}
