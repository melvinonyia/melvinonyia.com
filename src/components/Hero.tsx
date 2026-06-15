interface HeroProps {
  name: string
  pitch: string
  kicker?: string
}

export function Hero({ name, pitch, kicker = 'melvinonyia.com — v2 placeholder' }: HeroProps) {
  return (
    <section className="mx-auto max-w-2xl">
      <p className="font-mono text-sm text-muted">{kicker}</p>
      <h1 className="mt-4 text-4xl font-sans font-halbfett tracking-tight">
        {name}
      </h1>
      <p className="mt-2 text-lg text-muted">{pitch}</p>
    </section>
  )
}
