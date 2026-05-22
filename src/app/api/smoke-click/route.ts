import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SMOKE_VISITOR_COOKIE, makeVisitorId } from "@/lib/smoke-test/constants";
import { registerSmokeClick } from "@/lib/smoke-test/store";

type SmokeClickBody = {
  event?: string;
  target?: string;
  page?: string;
  variant?: string;
};

export async function POST(request: Request) {
  let payload: SmokeClickBody = {};

  try {
    payload = (await request.json()) as SmokeClickBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(SMOKE_VISITOR_COOKIE)?.value;
  let mustSetVisitorCookie = false;

  if (!visitorId) {
    visitorId = makeVisitorId();
    mustSetVisitorCookie = true;
  }

  const eventName = payload.event ?? "smoke_cta_clicked";
  const target = payload.target ?? "unknown";
  const page = payload.page ?? "unknown";
  const variant = payload.variant ?? "unknown";

  const result = registerSmokeClick(visitorId, variant);

  console.log(
    JSON.stringify({
      source: "fashionhero_smoke_test",
      event: eventName,
      target,
      page,
      variant,
      visitorId,
      counted: result.counted,
      at: new Date().toISOString(),
    })
  );

  const response = NextResponse.json({ ok: true, counted: result.counted }, { status: 200 });

  if (mustSetVisitorCookie) {
    response.cookies.set(SMOKE_VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
