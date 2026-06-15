import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '..', 'dist', 'client')

for (const slug of ['404', '500']) {
  const src = path.join(OUT_DIR, slug, 'index.html')
  const dest = path.join(OUT_DIR, `${slug}.html`)
  if (existsSync(src)) {
    copyFileSync(src, dest)
    console.log(`[postbuild] copied ${slug}/index.html -> ${slug}.html`)
  } else {
    console.warn(`[postbuild] WARN: ${src} not found`)
  }
}
