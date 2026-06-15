import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react'

export interface DemoProps {
  load: () => Promise<{ default: ComponentType }>
  placeholderHeight?: number
  caption?: string
}

const DEFAULT_HEIGHT = 320
const DEFAULT_CAPTION = 'Interactive demo'

function Placeholder({
  caption,
  height,
}: {
  caption: string
  height: number
}) {
  return (
    <div
      data-demo-placeholder
      style={{ minHeight: height }}
      className="flex h-full w-full items-center justify-center rounded-md border border-border/40 bg-surface/40"
    >
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        {caption}
      </p>
    </div>
  )
}

export function Demo({
  load,
  placeholderHeight = DEFAULT_HEIGHT,
  caption = DEFAULT_CAPTION,
}: DemoProps) {
  const [shouldMount, setShouldMount] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true)
            observer.disconnect()
            return
          }
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const LazyInner = useMemo(() => lazy(load), [load])

  return (
    <figure
      ref={ref}
      role="region"
      aria-label={caption}
      style={{ minHeight: placeholderHeight }}
      className="my-8 overflow-hidden"
    >
      {shouldMount ? (
        <Suspense
          fallback={<Placeholder caption={caption} height={placeholderHeight} />}
        >
          <LazyInner />
        </Suspense>
      ) : (
        <Placeholder caption={caption} height={placeholderHeight} />
      )}
    </figure>
  )
}
