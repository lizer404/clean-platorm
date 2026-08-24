import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isAdminRole } from "./app/lib/adminAuth";

/**
 * Server-side gate for the hidden owner panel.
 * - /secure-owner-panel → login screen (public entry)
 * - /secure-owner-panel/* → ADMIN session required, otherwise redirect home
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/secure-owner-panel" || pathname === "/secure-owner-panel/") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (isAdminRole(token)) {
      return NextResponse.redirect(
        new URL("/secure-owner-panel/dashboard", request.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/secure-owner-panel/")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!isAdminRole(token)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure-owner-panel", "/secure-owner-panel/:path*"],
};
