import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    if (isAuthPage && token) {
      // Redirect authenticated users away from auth pages
      const role = (token as any).role as string;
      return NextResponse.redirect(
        new URL(`/dashboard/${role}`, req.url)
      );
    }

    if (isDashboardPage && token) {
      const role = (token as any).role as string;
      const path = req.nextUrl.pathname;

      // Check if user is accessing correct role dashboard
      if (path.startsWith("/dashboard/teacher") && role !== "teacher") {
        return NextResponse.redirect(new URL("/dashboard/student", req.url));
      }

      if (path.startsWith("/dashboard/student") && role !== "student") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
        const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
        const isApiRoute = req.nextUrl.pathname.startsWith("/api");

        // Allow access to auth pages and public API routes
        if (isAuthPage || (!isDashboardPage && !isApiRoute)) {
          return true;
        }

        // Require authentication for dashboard and protected API routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};
