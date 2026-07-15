import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname.startsWith('/login');
  const isDashboardPage = pathname.startsWith('/dashboard');

  // If user is not logged in and attempts to access dashboard, redirect to login
  if (!token && isDashboardPage) {
    const loginUrl = new URL('/login', request.url);
    // Persist target path for redirection after login if wanted
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and attempts to access login page, redirect to dashboard
  if (token && isLoginPage) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all dashboard routes and login
  matcher: ['/dashboard/:path*', '/login'],
};
