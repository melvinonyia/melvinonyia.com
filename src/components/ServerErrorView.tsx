import { Link } from '@tanstack/react-router'

export function ServerErrorView() {
  return (
    <div className="error-container">
      <h2>Sorry!</h2>
      <h3>Something went wrong.</h3>
      <div className="error-cta">
        <Link to="/" className="hero-button" aria-label="Try again">
          Try again
        </Link>
      </div>
    </div>
  )
}
