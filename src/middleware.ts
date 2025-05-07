import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Ensure cookies are set with proper options
            const cookieOptions: Partial<ResponseCookie> = {
              ...options,
              path: '/',
              sameSite: 'lax' as const,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 1 week
            };
            // Only set cookies on the response, not the request
            supabaseResponse.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  try {
    // Check for session first
    const { data: { session } } = await supabase.auth.getSession();
    
    // Add session logging for debugging
    console.log('[Middleware] Session:', session);
    
    // Get the current user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Allow access to public routes
    if (
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/auth")
    ) {
      return supabaseResponse;
    }

    // Redirect unauthenticated users to sign-in page for protected routes
    if (!user || !session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users attempting to access the sign-in page to the dashboard page
    if (user && session && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, clear the session and redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "session_error");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};