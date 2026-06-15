// Vercel serverless function entry. Wraps the TanStack Start SSR handler
// produced at dist/server/server.js by `vite build`. Vercel auto-detects
// files under /api/ as Node serverless functions; the default export is a
// Web-standard fetch handler ((request: Request) => Promise<Response>).
//
// The dist/ directory does not exist in source control. Vercel's build runs
// `npm run build` before bundling functions, so dist/server/server.js is
// present when this file is traced.

import server from '../dist/server/server.js'

export default async function handler(request) {
  return server.fetch(request)
}
