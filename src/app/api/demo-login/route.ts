import { NextResponse } from "next/server";

import { DEMO_ROLE_COOKIE, getRoleHomePath } from "@/lib/auth/session";
import type { UserRole } from "@/types/domain";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const role = searchParams.get("role");
  const resolvedRole: UserRole = role === "admin" ? "admin" : "member";

  const response = NextResponse.redirect(`${origin}${getRoleHomePath(resolvedRole)}`);

  response.cookies.set(DEMO_ROLE_COOKIE, resolvedRole, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
