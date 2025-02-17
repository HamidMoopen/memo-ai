import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Allow auth callback to proceed
    if (req.nextUrl.pathname.startsWith('/auth/callback')) {
        return res;
    }

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // Redirect logged-in users away from auth pages
    if (['/login', '/signup'].includes(req.nextUrl.pathname)) {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup', '/auth/callback']
} 