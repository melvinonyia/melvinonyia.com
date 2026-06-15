// SMOKE TEST — temporary diagnostic. Returns immediately to verify
// Vercel function wiring works in isolation. Restore SSR delegation
// once we confirm 200 here.

export default async function handler(request) {
  const url = request && request.url ? request.url : '(no request.url)'
  return new Response(
    `smoke ok\nrequest.url=${url}\nnode=${process.version}\n`,
    {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    },
  )
}
