/**
 * NextJS Middleware
 * Xử lý authentication và authorization cho các routes
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes cần authentication
const protectedRoutes = [
  '/customer',
  '/staff',
  '/manager',
  '/admin',
  '/profile',
  '/booking',
];

// Routes theo role
const roleRoutes: Record<string, string[]> = {
  customer: ['/customer'],
  staff: ['/staff', '/customer'],
  manager: ['/manager', '/staff', '/customer'],
  admin: ['/admin', '/manager', '/staff', '/customer'],
};

// Public routes (không cần auth)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/services',
  '/blogs',
  '/about',
  '/contacts',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes và static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Kiểm tra xem route có cần protect không
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Lấy token từ cookie hoặc header
  const token = request.cookies.get('auth-token')?.value;

  // Nếu không có token, redirect về login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Lấy role từ cookie (được set sau khi login)
  const userRole = request.cookies.get('user-role')?.value;

  if (!userRole) {
    // Không có role, redirect về login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kiểm tra quyền truy cập theo role
  const allowedRoutes = roleRoutes[userRole] || [];
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!hasAccess) {
    // Không có quyền, redirect về trang phù hợp với role
    const defaultRoute = allowedRoutes[0] || '/';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  return NextResponse.next();
}

// Cấu hình matcher để chỉ áp dụng middleware cho các routes cần thiết
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

