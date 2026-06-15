interface HeroProps {
  name: string
  role: string
  pitch: string
}

export function Hero({ name, role, pitch }: HeroProps) {
  return (
    <section
      data-hero
      className="mx-auto max-w-6xl pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-40"
    >
      <h1
        className="font-serif text-fg leading-[0.92] tracking-tight"
        style={{ fontSize: 'clamp(4rem, 14vw, 12.5rem)' }}
      >
        {name}
      </h1>
      <p className="mt-10 font-mono text-xs uppercase tracking-wider text-fg">
        {role}
      </p>
      <p className="mt-2 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
        {pitch}
      </p>
    </section>
  )
}
