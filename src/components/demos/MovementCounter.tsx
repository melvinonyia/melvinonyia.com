import { useState } from 'react'

export default function MovementCounter() {
  const [reps, setReps] = useState(0)
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-border/40 bg-surface/60 px-6 py-8">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        rep counter
      </p>
      <p className="font-sans font-halbfett text-5xl text-fg tabular-nums">
        {reps}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setReps((n) => n + 1)}
          className="rounded-sm border border-accent/60 px-4 py-2 font-sans font-buch text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          +1 rep
        </button>
        <button
          type="button"
          onClick={() => setReps(0)}
          className="rounded-sm border border-border/60 px-4 py-2 font-sans font-buch text-sm text-muted transition-colors hover:text-fg hover:border-border focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          reset
        </button>
      </div>
    </div>
  )
}
