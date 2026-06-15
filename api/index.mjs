// Vercel serverless function entry. Delegates to the TanStack Start SSR
// handler produced at dist/server/server.js by `vite build`. The bundle
// is loaded lazily so any import-time failure surfaces in the response
// body — Vercel's default error UI swallows otherwise.

let cached

async function getServer() {
  if (!cached) {
    const mod = await import('../dist/server/server.js')
    cached = mod.default
  }
  return cached
}

export default async function handler(request) {
  try {
    const server = await getServer()
    return await server.fetch(request)
  } catch (err) {
    const msg = err && (err.stack || err.message) ? `${err.message}\n${err.stack}` : String(err)
    console.error('SSR handler error:', msg)
    return new Response('SSR handler error\n\n' + msg, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
}
