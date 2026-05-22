"use client";

import { useEffect, useState } from "react";

type ClickRecord = {
  visitorId: string;
  variant: string;
  at: string;
};

type SmokeStats = {
  totalUniqueClicks: number;
  perVariantUniqueClicks: Record<string, number>;
  totalEvents: number;
  recentEvents: ClickRecord[];
};

type StatsResponse = {
  ok: boolean;
  stats: SmokeStats;
};

export function DashboardLive({ initialStats }: { initialStats: SmokeStats }) {
  const [stats, setStats] = useState<SmokeStats>(initialStats);

  useEffect(() => {
    let isMounted = true;

    const refreshStats = async () => {
      try {
        const response = await fetch("/api/admin/smoke-stats", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as StatsResponse;
        if (isMounted && data.ok) {
          setStats(data.stats);
        }
      } catch {
        // Keep last known values when request fails.
      }
    };

    const intervalId = window.setInterval(refreshStats, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const variants = Object.entries(stats.perVariantUniqueClicks);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Unique clicks</p>
          <p className="mt-2 text-3xl font-medium text-charcoal">{stats.totalUniqueClicks}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Counted events</p>
          <p className="mt-2 text-3xl font-medium text-charcoal">{stats.totalEvents}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Refresh</p>
          <p className="mt-2 text-sm text-charcoal/80">Auto-update every 3s</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-medium text-charcoal">A/B - unique clicks</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {variants.length === 0 && <p className="text-[13px] text-warm-gray">No data yet.</p>}
          {variants.map(([variant, count]) => (
            <div key={variant} className="rounded-xl bg-cream-light p-3">
              <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Variant {variant}</p>
              <p className="mt-1 text-2xl font-medium text-charcoal">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-medium text-charcoal">Recent counted events</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-left text-[12px]">
            <thead>
              <tr className="text-warm-gray">
                <th className="px-2 py-2 font-medium">Time</th>
                <th className="px-2 py-2 font-medium">Visitor</th>
                <th className="px-2 py-2 font-medium">Variant</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEvents.map((item) => (
                <tr key={`${item.visitorId}-${item.at}`} className="border-t border-black/5">
                  <td className="px-2 py-2 text-charcoal/80">{item.at}</td>
                  <td className="px-2 py-2 text-charcoal/80">{item.visitorId}</td>
                  <td className="px-2 py-2 text-charcoal/80">{item.variant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
