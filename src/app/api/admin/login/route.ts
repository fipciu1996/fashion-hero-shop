import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/smoke-test/constants";

type LoginBody = { username?: string; password?: string };

export async function POST(request: Request) {
  let payload: LoginBody = {};

  try {
    payload = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.username !== "admin" || payload.password !== "admin") {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
