import { TextArrowCta } from './TextArrowCta'

export function ServerErrorView() {
  return (
    <div className="error-container">
      <div className="error-text">
        <h2>Sorry, you found a glitch</h2>
        <h3>Something went wrong.</h3>
        <div className="error-cta">
          <TextArrowCta to="/" label="Return Home" />
        </div>
      </div>
      <div className="error-illustration" aria-hidden="true">
        <img src="/images/error-500.svg" alt="" />
      </div>
    </div>
  )
}
