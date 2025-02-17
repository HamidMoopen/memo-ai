import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        // Create a new response first
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        
        const supabase = createRouteHandlerClient({ 
            cookies: () => Promise.resolve(cookies()) 
        });

        try {
            await supabase.auth.exchangeCodeForSession(code);
            return response;
        } catch (error) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Return to login if code is missing
    return NextResponse.redirect(new URL('/login', request.url));
} 