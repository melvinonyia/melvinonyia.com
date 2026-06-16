import { TextArrowCta } from './TextArrowCta'

export function NotFoundView() {
  return (
    <div className="error-container">
      <div className="error-text">
        <h2>Sorry, the page is missing</h2>
        <h3>We couldn&apos;t find what you were looking for.</h3>
        <div className="error-cta">
          <TextArrowCta to="/" label="Return Home" />
        </div>
      </div>
    </div>
  )
}
