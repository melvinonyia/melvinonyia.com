# Self-hosted fonts

The site loads Söhne (sans) and Berkeley Mono (mono) from this directory.
The actual `.woff2` files are licensed and **not** committed to the repo.

## Drop these files in before shipping

| Filename                       | Family         | Weight |
| ------------------------------ | -------------- | ------ |
| `soehne-buch.woff2`            | Söhne          | 400    |
| `soehne-halbfett.woff2`        | Söhne          | 600    |
| `berkeley-mono-regular.woff2`  | Berkeley Mono  | 400    |

## Sources

- **Söhne**: https://klim.co.nz/retail-fonts/soehne/ (web license)
- **Berkeley Mono**: https://berkeleygraphics.com/typefaces/berkeley-mono/

## Fallbacks

Until the licensed files are dropped in, the `@font-face` blocks in
`src/styles/globals.css` fall back to `Inter` / `JetBrains Mono` / system
fonts via `local()`. The site renders, but the typography won't be on-brand.
