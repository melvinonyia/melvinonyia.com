# Self-hosted fonts

The site loads Söhne (sans), Berkeley Mono (mono), and Editorial New
(display serif) from this directory. The actual `.woff2` files are
licensed and **not** committed to the repo.

## Drop these files in before shipping

| Filename                        | Family          | Weight | Used for                                              |
| ------------------------------- | --------------- | ------ | ----------------------------------------------------- |
| `soehne-buch.woff2`             | Söhne           | 400    | Body, long-form prose                                 |
| `soehne-halbfett.woff2`         | Söhne           | 600    | Emphasis, occasional headings                         |
| `berkeley-mono-regular.woff2`   | Berkeley Mono   | 400    | Masthead labels, datelines, mono tags, form labels    |
| `editorial-new-regular.woff2`   | Editorial New   | 400    | Hero name, page titles, essay titles, pull-quotes     |

## Sources

- **Söhne**: https://klim.co.nz/retail-fonts/soehne/ (web license)
- **Berkeley Mono**: https://berkeleygraphics.com/typefaces/berkeley-mono/
- **Editorial New**: https://pangrampangram.com/products/editorial-new (sold as "PP Editorial New"; rename the Regular weight file to `editorial-new-regular.woff2`)

## Fallbacks

Until the licensed files are dropped in, the `@font-face` blocks in
`src/styles/globals.css` fall back to `Inter` / `JetBrains Mono` /
`Times New Roman` / system fonts via `local()`. The site renders, but
the typography won't be on-brand.
