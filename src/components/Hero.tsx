interface HeroProps {
  name: string
  role: string
  pitch: string
}

export function Hero({ name, role, pitch }: HeroProps) {
  return (
    <section className="mx-auto max-w-3xl pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
      <h1 className="font-sans font-halbfett tracking-tight text-fg text-5xl sm:text-6xl lg:text-7xl">
        {name}
      </h1>
      <p className="mt-4 font-sans font-buch text-xl sm:text-2xl text-fg">{role}</p>
      <p className="mt-3 font-sans font-buch text-base sm:text-lg text-muted max-w-prose">
        {pitch}
      </p>
    </section>
  )
}
