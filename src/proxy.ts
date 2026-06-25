import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session");

  // Always allow login pages through
  if (pathname === "/login" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Other admin routes: no session → redirect
  if (pathname.startsWith("/admin")) {
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
