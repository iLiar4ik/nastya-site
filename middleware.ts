import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    if (isAuthPage && token) {
      // Redirect authenticated users away from auth pages
      const role = token.role as string;
      return NextResponse.redirect(
        new URL(`/dashboard/${role}`, req.url)
      );
    }

    if (isDashboardPage && token) {
      const role = token.role as string;
      const path = req.nextUrl.pathname;

      // Check if user is accessing correct role dashboard
      if (path.startsWith("/dashboard/teacher") && role !== "teacher") {
        return NextResponse.redirect(new URL("/dashboard/student", req.url));
      }

      if (path.startsWith("/dashboard/student") && role !== "student") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      }
    }

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Allow access to auth pages and public API routes
  if (isAuthPage || (!isDashboardPage && !isApiRoute)) {
    return NextResponse.next();
  }

  // Require authentication for dashboard and protected API routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};

