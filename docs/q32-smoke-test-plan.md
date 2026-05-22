# Q3.2 Smoke Test Plan

## Prototype type
- Smoke test (landing + CTA)

## Source artifact
- Quest Q3.1 Spec Forge artifact:
  - `3-Projects/fashion-hero-quest-q31-spec-forge/2026-05-22-q31-spec-forge-artifact.md`

## What we measure
- Event: `smoke_cta_clicked`
- Trigger: click on CTA `Uruchom promocje`
- Page: `/seller/promoted-listings-smoke`

## Decision thresholds
- Success: 100 clicks in 3 days
- Failure: below 100 clicks in 3 days

## Implementation in this repo
- Landing page: `src/app/seller/promoted-listings-smoke/page.tsx`
- CTA component: `src/app/seller/promoted-listings-smoke/smoke-test-cta.tsx`
- Tracking endpoint: `src/app/api/smoke-click/route.ts`

## How to count after deploy (Vercel)
1. Open Vercel project logs for production deployment.
2. Filter logs by `fashionhero_smoke_test` or `smoke_cta_clicked`.
3. Count matching log lines in the first 3 full days after launch.
4. Compare with thresholds above and decide build/kill/iterate.
