import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

  const supabase = createServerClient(
    url,
    key,
    {
      cookieOptions: {
        // Limit individual cookie size to prevent HTTP 431
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — keep this lean, no awaited render code
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes → redirect unauthenticated users to /login
  const protectedRoutes = [
    "/dashboard",
    "/jobs",
    "/skill-passport",
    "/apply",
    "/interview-checklist",
    "/feedback",
    "/accessibility",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const hasCompletedOnboarding = !!user?.user_metadata?.disability_type;

  // Protected routes → redirect unauthenticated users to /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated but onboarding incomplete → force redirect to /register
  if (user && !hasCompletedOnboarding) {
    if (pathname !== "/register" && pathname !== "/login" && pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/register";
      url.searchParams.set("oauth", "true");
      return NextResponse.redirect(url);
    }
  }

  // Redirect root URL to dashboard or login/register
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    if (user) {
      url.pathname = hasCompletedOnboarding ? "/dashboard" : "/register";
      if (!hasCompletedOnboarding) url.searchParams.set("oauth", "true");
    } else {
      url.pathname = "/login";
    }
    return NextResponse.redirect(url);
  }

  // Redirect authenticated & completed onboarding users away from auth pages
  if (user && hasCompletedOnboarding && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
