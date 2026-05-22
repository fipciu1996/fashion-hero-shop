import type { Metadata } from "next";
import { SmokeTestCta } from "./smoke-test-cta";

export const metadata: Metadata = {
  title: "FashionHero Ads MVP Smoke Test",
  description:
    "Smoke test for seller demand on paid promoted listings in FashionHero marketplace.",
};

export default function SellerAdsSmokeTestPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.8px] text-warm-gray">Q3.2 Smoke Test</p>
        <h1 className="mt-3 text-3xl font-light text-charcoal sm:text-4xl">
          Promoted Listings for Sellers
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-charcoal/80">
          Check whether you would pay for higher listing visibility if you could see expected
          reach and clicks before launch.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl bg-cream-light p-5 sm:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Test budget</p>
            <p className="mt-1 text-xl font-medium text-charcoal">300 PLN / 7 days</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Est. impressions</p>
            <p className="mt-1 text-xl font-medium text-charcoal">3,000 - 4,500</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Est. clicks</p>
            <p className="mt-1 text-xl font-medium text-charcoal">90 - 140</p>
          </div>
        </div>

        <div className="mt-8">
          <SmokeTestCta />
          <p className="mt-3 text-[12px] text-warm-gray">
            We measure CTA clicks. Success: 100 clicks in 3 days. Failure: below 100 clicks in 3
            days.
          </p>
        </div>
      </div>
    </main>
  );
}
