import { useNavigate } from '@tanstack/react-router'

export function NotFoundView() {
  const navigate = useNavigate()
  return (
    <div className="error-container">
      <h2>Sorry!</h2>
      <h3>The page you are looking for is not available</h3>
      <button
        type="button"
        className="error-button"
        onClick={() => navigate({ to: '/' })}
      >
        Try again
      </button>
    </div>
  )
}
