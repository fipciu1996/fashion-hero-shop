import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_AUTH_COOKIE } from "@/lib/smoke-test/constants";
import { getSmokeStats } from "@/lib/smoke-test/store";

export const dynamic = "force-dynamic";

export default async function AdminSmokeStatsPage() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(ADMIN_AUTH_COOKIE)?.value === "1";

  if (!isAuthed) {
    redirect("/admin/login");
  }

  const stats = getSmokeStats();
  const variants = Object.entries(stats.perVariantUniqueClicks);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-light text-charcoal">Smoke Test Dashboard</h1>
          <p className="mt-1 text-[13px] text-warm-gray">Unikalne klikniecia per uzytkownik</p>
        </div>
        <Link href="/seller/promoted-listings-smoke" className="btn-cta-outline text-[11px]">
          Otworz strone testu
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Unique clicks</p>
          <p className="mt-2 text-3xl font-medium text-charcoal">{stats.totalUniqueClicks}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Recent events</p>
          <p className="mt-2 text-3xl font-medium text-charcoal">{stats.totalEvents}</p>
        </div>
        <form action="/api/admin/logout" method="post" className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Session</p>
          <button type="submit" className="mt-3 btn-cta-outline w-full text-[11px]">
            Wyloguj
          </button>
        </form>
      </div>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-medium text-charcoal">A/B - unique clicks</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {variants.length === 0 && <p className="text-[13px] text-warm-gray">Brak danych.</p>}
          {variants.map(([variant, count]) => (
            <div key={variant} className="rounded-xl bg-cream-light p-3">
              <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">Wariant {variant}</p>
              <p className="mt-1 text-2xl font-medium text-charcoal">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-medium text-charcoal">Ostatnie zdarzenia</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-left text-[12px]">
            <thead>
              <tr className="text-warm-gray">
                <th className="px-2 py-2 font-medium">Czas</th>
                <th className="px-2 py-2 font-medium">Visitor</th>
                <th className="px-2 py-2 font-medium">Wariant</th>
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
    </main>
  );
}
