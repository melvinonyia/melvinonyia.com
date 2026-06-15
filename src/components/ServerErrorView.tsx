import { useNavigate } from '@tanstack/react-router'

export function ServerErrorView() {
  const navigate = useNavigate()
  return (
    <div className="error-container">
      <h2>Sorry!</h2>
      <h3>Something went wrong.</h3>
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
