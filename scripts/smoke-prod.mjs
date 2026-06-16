#!/usr/bin/env node
/**
 * Production smoke probe.
 *
 *   node scripts/smoke-prod.mjs                      # defaults to https://melvinonyia.com
 *   node scripts/smoke-prod.mjs https://example.com  # any base URL
 *
 * Fetches each routed page over HTTP and asserts:
 *   - 200 status
 *   - expected <title>
 *   - an expected on-page content marker
 *
 * Also probes sitemap.xml, rss.xml, robots.txt, 404.html (404 status expected
 * for an unknown URL).
 *
 * Pure Node, no browser. Run after a deploy to confirm the production URL
 * carries the right content before doing the full Playwright sweep.
 */
import process from 'node:process'

const baseUrl = (process.argv[2] ?? 'https://melvinonyia.com').replace(/\/$/, '')

const PAGES = [
  {
    path: '/',
    expectedTitle: /Melvin Onyia/,
    contentMarker: /Software Engineer/,
  },
  {
    path: '/about',
    expectedTitle: /About — Melvin Onyia/,
    contentMarker: /About/,
  },
  {
    path: '/work',
    expectedTitle: /Work — Melvin Onyia/,
    contentMarker: /Case studies/,
  },
  {
    path: '/work/movement-fingerprint',
    expectedTitle: /Movement fingerprint/,
    contentMarker: /Movement fingerprint/,
  },
  {
    path: '/writing',
    expectedTitle: /Writing — Melvin Onyia/,
    contentMarker: /Writing/,
  },
  {
    path: '/contact',
    expectedTitle: /Contact — Melvin Onyia/,
    contentMarker: /Send message|Drop a line/,
  },
  {
    path: '/privacy',
    expectedTitle: /Privacy — Melvin Onyia/,
    contentMarker: /Privacy/,
  },
  {
    path: '/terms',
    expectedTitle: /Terms — Melvin Onyia/,
    contentMarker: /Terms/,
  },
]

const STATIC_ASSETS = [
  { path: '/sitemap.xml', contentMarker: /<urlset/ },
  { path: '/rss.xml', contentMarker: /<rss/ },
  { path: '/robots.txt', contentMarker: /Sitemap:/ },
]

let failures = 0

async function probe(label, path, expectedStatus, checks) {
  const url = baseUrl + path
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (res.status !== expectedStatus) {
      console.log(`✗ ${label}  ${path}  expected ${expectedStatus}, got ${res.status}`)
      failures++
      return
    }
    const body = await res.text()
    for (const [name, predicate] of checks) {
      if (!predicate(body)) {
        console.log(`✗ ${label}  ${path}  check "${name}" failed`)
        failures++
        return
      }
    }
    console.log(`✓ ${label}  ${path}`)
  } catch (err) {
    console.log(`✗ ${label}  ${path}  ${err instanceof Error ? err.message : String(err)}`)
    failures++
  }
}

console.log(`Probing ${baseUrl}\n`)

for (const page of PAGES) {
  await probe('page  ', page.path, 200, [
    ['title', (b) => /<title>([^<]+)<\/title>/.test(b) && page.expectedTitle.test(b)],
    ['content marker', (b) => page.contentMarker.test(b)],
  ])
}

console.log('')
for (const asset of STATIC_ASSETS) {
  await probe('asset ', asset.path, 200, [
    ['content marker', (b) => asset.contentMarker.test(b)],
  ])
}

console.log('')
await probe('404   ', '/this-url-does-not-exist-xyz-' + Date.now(), 404, [
  ['on-brand body', (b) => /Off the map/.test(b)],
])

console.log('')
if (failures > 0) {
  console.log(`${failures} check(s) FAILED`)
  process.exit(1)
}
console.log('All probes passed.')
