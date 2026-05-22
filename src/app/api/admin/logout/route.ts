import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/smoke-test/constants";

export async function POST(request: Request) {
  const loginUrl = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(loginUrl, { status: 303 });
  response.cookies.set(ADMIN_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
