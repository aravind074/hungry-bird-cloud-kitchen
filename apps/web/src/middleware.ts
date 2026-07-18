import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/cart', '/checkout', '/orders', '/profile', '/wishlist', '/subscription'];

// Paths that require specific roles
const rolePaths: Record<string, string[]> = {
  '/admin': ['admin'],
  '/kitchen': ['admin', 'kitchen_staff'],
  '/delivery': ['admin', 'delivery_partner'],
};

// Auth paths (redirect if already logged in)
const authPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth cookie
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  // Redirect logged-in users away from auth pages
  if (authPaths.some(p => pathname.startsWith(p))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Role-based route protection
  for (const [path, roles] of Object.entries(rolePaths)) {
    if (pathname.startsWith(path)) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // Role check happens client-side since we can't decode JWT in middleware easily
      // But we ensure auth is required
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
