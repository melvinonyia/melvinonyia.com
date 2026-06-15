import { Link } from '@tanstack/react-router'

export function NotFoundView() {
  return (
    <div className="error-container">
      <div className="error-text">
        <h2>Sorry, the page is missing</h2>
        <h3>We couldn&apos;t find what you were looking for.</h3>
        <div className="error-cta">
          <Link to="/" className="hero-button" aria-label="Return Home">
            Return Home
          </Link>
        </div>
      </div>
      <div className="error-illustration" aria-hidden="true">
        <img src="/images/error-404.png" alt="" />
      </div>
    </div>
  )
}
