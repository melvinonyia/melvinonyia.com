# Domain cutover: melvinonyia.com → new Vercel deployment

## What to build

Promote the new site to production. Point the `melvinonyia.com` apex and `www` DNS records at the new Vercel deployment, verify the SSL provisioning, run the smoke pass against the production URL, then decommission the previous `public-client` deployment and its supporting infrastructure (the relevant DO container, ingress, cert, and DNS bits in the existing `apps` repo's `/infra` and `/k8s` directories).

This slice is **HITL**: requires the operator to update DNS in the domain registrar, confirm the cutover, and run the post-cutover smoke pass.

## Acceptance criteria

- [ ] New site deployed to Vercel production (not preview)
- [ ] `melvinonyia.com` apex and `www` DNS records point at the new Vercel deployment
- [ ] Vercel provisions a valid TLS cert for both apex and `www`
- [ ] Production smoke pass (subset of slice #16) runs green against `melvinonyia.com`
- [ ] Old `public-client` deployment torn down: container removed, ingress removed, cert released, leftover DNS records cleared
- [ ] Final `git log` annotation or release tag captured for the cutover

## Blocked by

- #16 (Playwright smoke + Lighthouse pass)
