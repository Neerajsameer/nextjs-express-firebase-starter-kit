import { NextRequest, NextResponse } from "next/server";

// Define auth routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is an auth route (login/signup)

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get the Firebase ID token from cookies
  const token = request.cookies.get("firebase-token")?.value;

  // If accessing a protected route without a token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes with a valid token, redirect to dashboard
  if (isPublicRoute && token) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
