import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/smoke-test/constants";
import { getSmokeStats } from "@/lib/smoke-test/store";

export async function GET() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(ADMIN_AUTH_COOKIE)?.value === "1";

  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getSmokeStats();
  return NextResponse.json({ ok: true, stats }, { status: 200 });
}
