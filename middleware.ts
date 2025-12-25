import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  // If accessing dashboard but not logged in → redirect to /
  if (pathname.startsWith("/admin/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If accessing login page but already logged in → redirect to dashboard
  if (pathname.startsWith("/admin/login") && token) {
    return NextResponse.redirect(new URL("/super-admin/dashboard", req.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: ["/super-admin/dashboard", "/super-admin/login"],
};