import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('auth_token');

        if (!token) {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If accessing login page while authenticated, redirect to admin dashboard
    if (pathname === '/admin/login') {
        const token = request.cookies.get('auth_token');

        if (token) {
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
