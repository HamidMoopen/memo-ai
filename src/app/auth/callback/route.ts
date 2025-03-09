import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error.message}`, request.url))
    }

    if (!data.session) {
      return NextResponse.redirect(new URL('/login?error=no_session', request.url))
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=unknown', request.url))
  }
}
