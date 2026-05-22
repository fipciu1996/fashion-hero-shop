# Q3.2 Smoke Test Plan

## Prototype type
- Smoke test (landing + CTA)

## Source artifact
- Quest Q3.1 Spec Forge artifact:
  - `3-Projects/fashion-hero-quest-q31-spec-forge/2026-05-22-q31-spec-forge-artifact.md`

## What we measure
- Event: `smoke_cta_clicked`
- Trigger: click on CTA (`Uruchom promocje` or `Sprawdz estymacje promocji`)
- Counting model: max 1 counted click per user (`fh_smoke_visitor` cookie)
- Page: `/seller/promoted-listings-smoke`
- Variant: `A` (`Uruchom promocje`) vs `B` (`Sprawdz estymacje promocji`)

## Decision thresholds
- Success: 100 unique clicks in 3 days
- Failure: below 100 unique clicks in 3 days

## Implementation in this repo
- Landing page: `src/app/seller/promoted-listings-smoke/page.tsx`
- CTA component: `src/app/seller/promoted-listings-smoke/smoke-test-cta.tsx`
- Tracking endpoint: `src/app/api/smoke-click/route.ts`
- Admin login page: `src/app/admin/login/page.tsx`
- Admin dashboard: `src/app/admin/smoke-stats/page.tsx`
- Admin stats API: `src/app/api/admin/smoke-stats/route.ts`

## Admin access
- URL login: `/admin/login`
- URL dashboard: `/admin/dashboard/report`
- Credentials: `admin/admin`

## How to read results
1. Open `/admin/smoke-stats` and log in as admin.
2. Read `Unique clicks` as main KPI.
3. Compare with threshold after 3 days.
