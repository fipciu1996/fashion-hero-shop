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
  let parsedJson: unknown;

  try {
    parsedJson = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!parsedJson || typeof parsedJson !== "object" || Array.isArray(parsedJson)) {
    return NextResponse.json({ error: "JSON body must be an object" }, { status: 400 });
  }

  const payload = parsedJson as SmokeClickBody;

  if (payload.event !== undefined && typeof payload.event !== "string") {
    return NextResponse.json({ error: "event must be a string" }, { status: 400 });
  }
  if (payload.target !== undefined && typeof payload.target !== "string") {
    return NextResponse.json({ error: "target must be a string" }, { status: 400 });
  }
  if (payload.page !== undefined && typeof payload.page !== "string") {
    return NextResponse.json({ error: "page must be a string" }, { status: 400 });
  }
  if (payload.variant !== undefined && typeof payload.variant !== "string") {
    return NextResponse.json({ error: "variant must be a string" }, { status: 400 });
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

  const result = await registerSmokeClick(visitorId, variant);

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
