import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log("🔄 Auth callback triggered");
    console.log("📍 Request URL:", request.url);
    
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    console.log("🔑 Auth code present:", !!code);

    if (!code) {
      console.error("❌ No code parameter found");
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }
    
    const supabase = await createClient()
    console.log("🔌 Supabase client created");

    console.log("🔄 Exchanging code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("❌ Session exchange error:", error);
      return NextResponse.redirect(new URL(`/login?error=${error.message}`, request.url))
    }

    console.log("✅ Session data received:", !!data.session);
    
    if (!data.session) {
      console.error("❌ No session in response data");
      return NextResponse.redirect(new URL('/login?error=no_session', request.url))
    }

    console.log("🎯 Redirecting to dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error("💥 Callback error:", error);
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
