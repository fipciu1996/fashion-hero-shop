import { NextResponse } from "next/server";

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

  const eventName = payload.event ?? "smoke_cta_clicked";
  const target = payload.target ?? "unknown";
  const page = payload.page ?? "unknown";
  const variant = payload.variant ?? "unknown";

  console.log(
    JSON.stringify({
      source: "fashionhero_smoke_test",
      event: eventName,
      target,
      page,
      variant,
      at: new Date().toISOString(),
    })
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}
