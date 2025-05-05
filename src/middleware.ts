// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// Middleware function จะทำงานกับทุก request
export function middleware(request: NextRequest) {
  // ดู url ของ request
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('auth-token')?.value;
  const protectedPaths = ['/dashboard', '/news', '/knowledge', '/gallery', '/forum', '/courses'];
  // ตัวอย่างการเช็คว่าผู้ใช้เข้าถึง route ที่ต้องการ authentication หรือไม่
  if (pathname === '/login' && token) {
    // redirect ไปที่หน้า dashboard หรือหน้าหลักแทน
    const url = new URL('/dashboard', request.url);
    console.log("adasd : " ,pathname)
    return NextResponse.redirect(url);
  }
  if (protectedPaths.some(path => pathname.startsWith(path))) {

    if (!token) {
      // ถ้าไม่มี token ให้ redirect ไปที่หน้า login
      const url = new URL('/login', request.url);
      // ส่ง URL ที่ user พยายามเข้าถึงไปด้วยเพื่อ redirect กลับมาหลังจาก login
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // ถ้าไม่มีเงื่อนไขใดทำงาน ปล่อยให้ request ผ่านไป
  return NextResponse.next();
}

// กำหนด paths ที่ middleware จะทำงานด้วย
export const config = {
  // ใช้ matcher เพื่อกำหนด paths ที่ต้องการให้ middleware ทำงาน
  matcher: [
    // ใช้กับทุก route ที่ขึ้นต้นด้วย /dashboard
    '/dashboard/:path*',
    // ใช้กับทุก route ที่ขึ้นต้นด้วย /api
    '/api/:path*',
    '/news', '/knowledge', '/gallery', '/forum', '/courses','/login'
  ],
}