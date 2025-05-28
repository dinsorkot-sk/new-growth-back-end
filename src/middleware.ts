// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// Middleware function จะทำงานกับทุก request
export function middleware(request: NextRequest) {
  // ดู url ของ request
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth-token')?.value;
  const protectedPaths = [
    '/admin/dashboard', '/admin/news', '/admin/knowledge', '/admin/gallery', '/admin/forum', '/admin/courses', '/admin/admission', '/admin/admin'
  ];

  // Redirect root path to admin login
  if (pathname === '/') {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  // ถ้ามี token และพยายามเข้าหน้า login ให้ redirect ไป dashboard
  if (pathname === '/admin/login' && token) {
    const url = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  // ถ้าไม่มี token และพยายามเข้าหน้า protected ให้ redirect ไป login
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect /login to /admin/login
  if (pathname === '/login') {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// กำหนด paths ที่ middleware จะทำงานด้วย
export const config = {
  // ใช้ matcher เพื่อกำหนด paths ที่ต้องการให้ middleware ทำงาน
  matcher: [
    // ใช้กับทุก route ที่ขึ้นต้นด้วย /api
    '/api/:path*',
    '/',
    '/login',
    '/admin',
    '/admin/:path*'
  ],
}