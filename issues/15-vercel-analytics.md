# Vercel Analytics + Speed Insights

## What to build

Wire Vercel Analytics and Vercel Speed Insights into the app via the official integration. Verify at deploy time that the analytics is operating in cookieless mode so no consent banner is required. No other tracking, no PostHog, no Mixpanel, no third-party tags.

## Acceptance criteria

- [ ] Vercel Analytics script integrated and reporting page views on the preview deployment
- [ ] Vercel Speed Insights integrated and reporting Web Vitals on the preview deployment
- [ ] Network panel confirms no cookies are set by the analytics script
- [ ] No third-party tracking scripts loaded beyond Vercel's own
- [ ] Lighthouse Best Practices score is not regressed by the integration

## Blocked by

- #1 (Bootstrap)
