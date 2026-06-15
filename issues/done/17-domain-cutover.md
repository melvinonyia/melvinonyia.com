# Domain cutover: melvinonyia.com → new Vercel deployment

## What to build

Promote the new site to production. Point the `melvinonyia.com` apex and `www` DNS records at the new Vercel deployment, verify the SSL provisioning, run the smoke pass against the production URL, then decommission the previous `public-client` deployment and its supporting infrastructure (the relevant DO container, ingress, cert, and DNS bits in the existing `apps` repo's `/infra` and `/k8s` directories).

This slice is **HITL**: requires the operator to update DNS in the domain registrar, confirm the cutover, and run the post-cutover smoke pass.

## Acceptance criteria

- [ ] New site deployed to Vercel production (not preview) — *HITL, runbook below*
- [ ] `melvinonyia.com` apex and `www` DNS records point at the new Vercel deployment — *HITL*
- [ ] Vercel provisions a valid TLS cert for both apex and `www` — *HITL, verifiable via the runbook's TLS step*
- [ ] Production smoke pass (subset of slice #16) runs green against `melvinonyia.com` — *HITL, runnable as `PLAYWRIGHT_BASE_URL=https://melvinonyia.com npm run test:e2e e2e/smoke.spec.ts` or `npm run smoke:prod`*
- [ ] Old `public-client` deployment torn down: container removed, ingress removed, cert released, leftover DNS records cleared — *HITL, checklist below*
- [ ] Final `git log` annotation or release tag captured for the cutover — *HITL*

## Blocked by

- #16 (Playwright smoke + Lighthouse pass)

---

## Status note (2026-06-15)

The cutover itself is HITL — every acceptance criterion requires the operator to take an action outside this codebase (registrar UI, Vercel dashboard, the existing `apps` repo's `infra/`/`k8s/`). What's shipped in *this* slice is the **tooling and the runbook** that make the manual cutover safe and reproducible.

### Tooling shipped

- **`PLAYWRIGHT_BASE_URL` override** (`playwright.config.ts`). When set, the Playwright config skips its local `webServer` and aims the test suite at the external URL. Lets the existing 14-test smoke pass run against the live site after DNS propagates.
- **`scripts/smoke-prod.mjs`** — a no-browser HTTP probe runnable as `npm run smoke:prod`. Default base URL is `https://melvinonyia.com`; override via positional arg (`node scripts/smoke-prod.mjs https://preview-xyz.vercel.app`). For each of the seven main routes it asserts a 200 status, the expected `<title>`, and an on-page content marker. Also probes `/sitemap.xml`, `/rss.xml`, `/robots.txt`, and an unknown URL (asserting 404 status + the on-brand "Off the map" body). Self-tested against the local `dist/client` served by `npx serve`: all 11 probes green. Pure Node, runs in ~1s.
- **`--single` removed from the local Playwright `serve` invocation.** That flag was rewriting every URL to `index.html` with a 200 status — masking 404 behavior. Vercel does NOT do this for static deployments; it serves `404.html` with a 404 status. The local config now matches production behavior — the 404 smoke test now exercises the actual error path.

### Cutover runbook (HITL)

Run these in order. Each step ends with a verification you can paste into a terminal to confirm the previous step worked.

#### 0. Pre-flight

```
git status                                    # clean working tree
git log --oneline | head -5                   # confirm cutover commit is HEAD
npm test && npm run typecheck && npm run build && npm run test:e2e
```

All must pass. Address any failures before touching DNS.

#### 1. Push and deploy to Vercel preview

```
git push origin main
```

If the GitHub repo is connected to a Vercel project, a preview deploy will start automatically. Watch it in the Vercel dashboard. If not connected yet:

1. Vercel dashboard → "New Project" → import the GitHub repo.
2. Framework Preset: leave as "Other" (the repo's `vercel.json` already declares `framework: null`, `buildCommand: npm run build`, `outputDirectory: dist/client`).
3. Environment variables (Production + Preview): `RESEND_API_KEY` (HITL — get from Resend dashboard), `CONTACT_TARGET_EMAIL` (`melvin.onyia@gmail.com`), `CONTACT_FROM_EMAIL` (must be a verified-on-Resend sender — likely `contact@melvinonyia.com` after Resend domain verification, or `onboarding@resend.dev` for first-day sandbox).
4. Project → Settings → Analytics → Enable. Same for Speed Insights.
5. Deploy.

Note the preview URL Vercel hands you (e.g., `melvinonyia-v2-abc123.vercel.app`).

#### 2. Smoke the preview deployment

```
node scripts/smoke-prod.mjs https://<preview-url>.vercel.app
PLAYWRIGHT_BASE_URL=https://<preview-url>.vercel.app npx playwright test e2e/smoke.spec.ts
```

Both must be green. If `smoke-prod` fails, fix forward before touching DNS. If Playwright fails on the contact form, check that the route interception is still active — the test deliberately stubs `/api/contact` to avoid spamming the real inbox during smoke.

Also: visit the preview URL in a real browser and paste it into a Twitter/Slack/LinkedIn unfurl previewer to confirm the OG card renders. If OG images aren't in `public/og/` yet, expect blank cards — finish that HITL drop before the cutover (see issue #13 caveats).

#### 3. Promote to production in Vercel

1. Vercel dashboard → Project → Deployments → find the green preview from step 2 → "..." → **Promote to Production**.
2. Confirm in the dashboard that the deployment is marked Production.

#### 4. Add the production domain in Vercel

1. Vercel dashboard → Project → Settings → Domains.
2. Add `melvinonyia.com` (apex).
3. Add `www.melvinonyia.com` and set it to redirect to the apex (or vice versa — pick one canonical, the existing `homeHead.ts` SITE_URL is the apex form `https://melvinonyia.com`).

Vercel will show the DNS records you need to add at your registrar:
   - Apex: an A record pointing at `76.76.21.21` (Vercel's apex IP), or an ALIAS/ANAME if the registrar supports it.
   - `www`: a CNAME pointing at `cname.vercel-dns.com`.

#### 5. Update DNS at the registrar

Log into the registrar where `melvinonyia.com` is registered.

1. Remove the existing A/AAAA/CNAME for the apex and `www` that currently point at the old `public-client` infra.
2. Add the records Vercel showed you in step 4.
3. Save.

DNS propagation usually takes 1–5 minutes for Vercel-managed records but can take longer at some registrars or for some resolvers.

Verification:

```
dig +short A melvinonyia.com
dig +short CNAME www.melvinonyia.com
```

Expect `76.76.21.21` for apex and `cname.vercel-dns.com.` for `www`. If they still return the old infra, wait a minute and re-check.

#### 6. Verify Vercel provisioned TLS

After DNS resolves, Vercel automatically requests a Let's Encrypt cert.

1. Vercel dashboard → Project → Settings → Domains → both domains should show a green "Valid Configuration" badge AND a "Valid Certificate" badge.
2. Production smoke:

```
curl -sI https://melvinonyia.com | head -1
curl -sI https://www.melvinonyia.com | head -1
```

Both should return `HTTP/2 200` (or `HTTP/2 308` for `www` if you set up the redirect).

#### 7. Production smoke pass

```
node scripts/smoke-prod.mjs https://melvinonyia.com
PLAYWRIGHT_BASE_URL=https://melvinonyia.com npx playwright test e2e/smoke.spec.ts
```

Both green = the production deploy is live and behaving. If anything regresses vs. the preview smoke in step 2, the most common cause is environment variables being set on Preview but not Production — re-check Vercel → Project → Settings → Environment Variables and confirm each one has the Production scope checked.

#### 8. Verify analytics flow

1. Open https://melvinonyia.com in a fresh browser tab. Click around a few pages.
2. Vercel dashboard → Project → Analytics — within ~60s you should see at least 1 visitor and a few page views.
3. Vercel dashboard → Project → Speed Insights — within ~60s you should see the first Web Vitals data point.
4. Open browser DevTools → Application → Cookies on melvinonyia.com — confirm no analytics-related cookies are set (the SDK is cookieless by default; this confirms it).

#### 9. Tear down the old `public-client` infrastructure

This lives in the existing `apps` repo (sibling repo), not this one. The acceptance criterion enumerates four things to remove:

| Component | Likely location | Action |
| --- | --- | --- |
| Old container deployment | `apps/.../k8s/public-client/deployment.yaml` | Delete file + remove kustomization reference |
| Ingress route | `apps/.../k8s/public-client/ingress.yaml` | Delete file + remove kustomization reference |
| TLS cert | cert-manager `Certificate` resource for `melvinonyia.com` | Delete the resource so cert-manager releases the cert |
| Leftover DNS | Already replaced in step 5; nothing further | (none) |
| DigitalOcean container | DO dashboard → Apps/Droplets/Container Registry | Delete the image + deployment |

Run the same dry-run/apply cycle the apps repo normally uses (likely `kubectl apply -k` after merging the deletion PR). Confirm the cluster reports the resources gone:

```
kubectl get pods -A | grep public-client
kubectl get ingress -A | grep melvinonyia
kubectl get certificate -A | grep melvinonyia
```

All should return empty.

Also: search the apps repo for any other reference to `melvinonyia.com` and clean up.

#### 10. Annotate and tag the release

```
git tag -a v1.0.0 -m "Domain cutover to Vercel — production live at https://melvinonyia.com"
git push origin v1.0.0
```

GitHub → Releases → "Draft a new release" → pick the tag → paste a short release note (e.g., "First public release on Vercel. Replaces the old public-client deployment in apps/.").

### What this slice does NOT do

- It does not touch the registrar, Vercel, or the apps repo. All of those are outside this codebase.
- It does not push to origin. The user pushes when they're ready to deploy.
- It does not enforce the runbook order — there's no script that runs all of step 1–10 in sequence, because each step requires a human checkpoint (look at the Vercel UI, look at `dig`, look at the live site).

## Caveats

- **DNS propagation can be slow at some registrars.** If `dig` still returns the old IP after 10 minutes, it's a registrar TTL issue — check the previous record's TTL value, and either wait it out or contact the registrar's support to flush. Browsers cache DNS too; use `chrome://net-internals/#dns` (or equivalent) to clear the browser-side cache when verifying.
- **Resend domain verification is its own multi-step process.** If `CONTACT_FROM_EMAIL` points at `contact@melvinonyia.com` but the domain isn't verified on Resend, the `/api/contact` POST will succeed at the handler layer but Resend will reject the send → the user sees the "Couldn't send right now" error in the form. Either: (a) verify the domain on Resend before cutover, or (b) set `CONTACT_FROM_EMAIL` to a verified Resend sandbox sender for the first day, then switch over once the domain is verified.
- **The old `apps` repo's teardown PR should be merged AFTER the new site is verified live.** Don't tear down the old infra before confirming the new one works — that's a one-way change that strands users on broken DNS for the propagation window if anything goes wrong.
- **Old `/work/*` paths from the previous site are not redirected.** Per the caveat in issue #14: any old work-detail URL on the previous site will land on the on-brand 404 (correct behavior for non-existent content) but won't preserve link equity. If any old slug deserves a redirect to a new equivalent, add a `redirects` entry in `vercel.json` BEFORE step 3:
  ```json
  {
    "redirects": [
      { "source": "/old-slug", "destination": "/work/new-slug", "permanent": true }
    ]
  }
  ```
  The cutover commit should bundle these.
- **`smoke-prod.mjs` does not run Playwright.** It's the lightweight HTTP probe for quick post-deploy sanity. Playwright is the deeper interactive check. Run both — they cover different surfaces (smoke-prod catches "the deploy is up and serving the right content"; Playwright catches "the interactive flows work end-to-end").
- **The "release tag captured" criterion is purely conventional.** Tagging is documented in step 10 of the runbook, but nothing in this codebase auto-creates the tag. Some operators prefer dated tags (`v2026.06.15`) or semver-from-zero (`v1.0.0`). Pick a convention now; future releases will follow whatever's set here.
- **Lighthouse scores will be measured for real at this point.** The thresholds in `lighthouserc.json` (≥0.95 desktop on all four categories) bite on the first CI run that lands after the cutover commit is on main. If any of the six routes is short by ≥3 points, the most likely fix is: split `CommandPalette` UI into a `React.lazy` chunk (~5KB+ saved from main bundle).
