import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { decrypt } from './lib/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/signin', '/signup'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.cookies.set('next-url', req.nextUrl.pathname);

  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isProtectedRoute && session?.userId && session?.role === 'Customer') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    if (session?.role === 'Admin') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    } else if (session?.role === 'Customer') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  return res;
}

// Apply middleware only to protected paths
export const config = {
  matcher: ['/:path*'],
};
