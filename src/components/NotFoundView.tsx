import { Link } from '@tanstack/react-router'

export function NotFoundView() {
  return (
    <div className="error-container">
      <h2>Sorry!</h2>
      <h3>The page you are looking for is not available</h3>
      <div className="error-cta">
        <Link to="/" className="hero-button" aria-label="Try again">
          Try again
        </Link>
      </div>
    </div>
  )
}
