import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect based on role
    if (token) {
      if (path.startsWith("/teacher") && token.role !== "teacher") {
        return NextResponse.redirect(new URL("/student", req.url))
      }
      if (path.startsWith("/student") && token.role !== "student") {
        return NextResponse.redirect(new URL("/teacher", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Public routes
        if (
          path === "/" ||
          path.startsWith("/tariffs") ||
          path.startsWith("/about") ||
          path.startsWith("/contacts") ||
          path.startsWith("/lessons") ||
          path === "/login"
        ) {
          return true
        }

        // Protected routes require authentication
        if (path.startsWith("/teacher") || path.startsWith("/student")) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/teacher/:path*",
    "/student/:path*",
  ],
}

