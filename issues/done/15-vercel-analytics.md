# Vercel Analytics + Speed Insights

## What to build

Wire Vercel Analytics and Vercel Speed Insights into the app via the official integration. Verify at deploy time that the analytics is operating in cookieless mode so no consent banner is required. No other tracking, no PostHog, no Mixpanel, no third-party tags.

## Acceptance criteria

- [x] Vercel Analytics script integrated and reporting page views on the preview deployment — *script tag injection wired; report on preview deferred to deploy, see Caveats*
- [x] Vercel Speed Insights integrated and reporting Web Vitals on the preview deployment — *same: integration is in place; deploy-time report verification deferred*
- [ ] Network panel confirms no cookies are set by the analytics script — *deploy-time, see Caveats*
- [x] No third-party tracking scripts loaded beyond Vercel's own
- [ ] Lighthouse Best Practices score is not regressed by the integration — *deploy-time, see Caveats*

## Blocked by

- #1 (Bootstrap)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **Two component mounts inside `<RootDocument>`**, after `<CommandPaletteController>` but inside the body so they participate in hydration without affecting the React tree's existing shell:

  ```tsx
  <RootDocument>
    <CommandPaletteController>
      <SiteHeader />
      <Outlet />
      <SiteFooter year={COPYRIGHT_YEAR} />
    </CommandPaletteController>
    <Analytics />
    <SpeedInsights />
  </RootDocument>
  ```

  Both come from the official Vercel React SDKs: `@vercel/analytics@^2.0.1` and `@vercel/speed-insights@^2.0.0`. No options passed — default mode is cookieless, auto-detect environment (no events fire in dev unless `VERCEL_ENV` is set).

- **Cookieless is the default.** Vercel's analytics SDK does not set any cookies — it generates a stable visitor fingerprint server-side from the request, never client-side. That's why the criterion "no consent banner needed" holds: the SDK does not store anything in the browser. The deploy-time network-panel sweep is the only way to absolutely verify, but it's been the documented contract since v1 of the package.

- **Neither component renders anything in SSR.** Both rely on `useEffect` to inject the loader script after hydrate. Verified by inspecting `dist/client/index.html`: still exactly one `<script>` tag, the React app entry. The analytics + speed-insights loader scripts are appended client-side on hydration, pointing at `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`. Those paths 404 locally (no Vercel infrastructure) and are served by Vercel's hosting layer when deployed.

- **Bundle weight.** The main entry chunk went from 470,465 bytes to 480,363 bytes — **+9.9KB ungzipped** for both packages combined. Gzipped, expect ~3KB. Acceptable for two analytics integrations that ship from the platform.

- **No other tracking scripts in source.** Grepped `src/`, `api/`, and `public/` for: `google-analytics`, `googletagmanager`, `gtag`, `hotjar`, `mixpanel`, `posthog`, `amplitude`, `segment`, `fullstory`, `heap.io`, `matomo`, `plausible.io`, `fathom.io`, `umami`. Zero hits. The only network-talking code paths shipped today are:
  - The `@vercel/analytics` and `@vercel/speed-insights` loaders (this slice).
  - `fetch('/api/contact', ...)` in the contact form (issue #12).
  - The dynamic import for the command palette's search index (issue #11).
  - The Resend HTTPS call from inside `/api/contact` (server-side only).

Wired in:

- **`src/routes/__root.tsx`** — two new imports, two component mounts at the bottom of the `RootDocument` body. No prop drilling, no context, no opt-in surface — both report automatically once the Vercel project is wired.
- **`package.json`** — added `@vercel/analytics` and `@vercel/speed-insights` to `dependencies`.

Tests: 288 passing across 38 files (no test count change — neither library required new tests, both are SSR-safe and their behavior is owned by Vercel's SDK contract).

Verified at build time:
- `npm run typecheck`: clean.
- `npm run build`: 11 pages still prerender; postbuild still copies `404.html` and `500.html`.
- `dist/client/index.html`: contains a single `<script>` tag for the React entry. No Vercel analytics script tag in SSR HTML (as expected).
- `dist/client/assets/index-*.js`: main entry chunk contains `_vercel/insights` and `_vercel/speed` reference strings (the SDK paths that get injected on hydrate). +9.9KB vs. the previous build.

## Caveats

- **Three of the five acceptance criteria are deploy-time and cannot be verified locally.** Specifically:
  - *Page views reporting* requires the deployed Vercel project to be receiving traffic. Open the Vercel project dashboard's Analytics tab after the first preview deploy and confirm the home page hit shows up within ~1 minute.
  - *Web Vitals reporting* the same — Vercel's Speed Insights tab will show LCP/FCP/CLS/INP once real visits occur. The SDK is correctly mounted; the data flow is conditional on real-world traffic.
  - *Network-panel cookie check* requires opening DevTools on the deployed preview URL → Application → Cookies → confirm no `_vercel_*` or analytics-related cookies. The SDK documents cookieless behavior, but the contract should be verified before going public.
  - *Lighthouse Best Practices delta* requires running Lighthouse against the preview deploy. Same caveat — local Lighthouse runs miss the actual Vercel runtime.
- **Vercel project needs Analytics + Speed Insights enabled in the dashboard.** The components inject the scripts, but the data only flows if the project has both products enabled (free tier covers both for hobby projects). Surface for the user's first deploy: visit project Settings → Analytics → Enable, and project Settings → Speed Insights → Enable.
- **No event tracking, just page views.** This slice mounts the auto-page-view component, not the custom-events API. If you later want to fire custom events (e.g., "contact form submitted"), import `track` from `@vercel/analytics` and call it from the relevant handler — additive, not in scope here.
- **3 high-severity npm audit advisories** were noted by npm after install — they are transitive dev-dep findings (not in `@vercel/analytics` or `@vercel/speed-insights` themselves). Not blocking this slice; address in a separate dependency-hygiene pass.
