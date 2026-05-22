import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_AUTH_COOKIE } from "@/lib/smoke-test/constants";
import { getSmokeStats } from "@/lib/smoke-test/store";
import { DashboardLive } from "./dashboard-live";

export const dynamic = "force-dynamic";

export default async function AdminSmokeStatsPage() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(ADMIN_AUTH_COOKIE)?.value === "1";

  if (!isAuthed) {
    redirect("/admin/login");
  }

  const stats = getSmokeStats();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-light text-charcoal">Smoke Test Dashboard</h1>
          <p className="mt-1 text-[13px] text-warm-gray">Unique clicks per visitor</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/seller/promoted-listings-smoke" className="btn-cta-outline text-[11px]">
            Open test page
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="btn-cta-outline text-[11px]">
              Log out
            </button>
          </form>
        </div>
      </div>

      <DashboardLive initialStats={stats} />
    </main>
  );
}
