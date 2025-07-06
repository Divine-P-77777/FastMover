import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect these routes
const protectedRoutes = [
  '/admin',
  '/driver/dashboard',
  '/client/dashboard',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on protected paths
  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('sb-access-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth?error=unauthorized', request.url));
  }

  // You can optionally forward the token to validate role from Supabase API here
  // For now just let through if token exists
  return NextResponse.next();
}

// Define which paths to match
export const config = {
  matcher: [
    '/admin/:path*',
    '/client/dashboard/:path*',
    '/driver/dashboard/:path*',
  ],
};
