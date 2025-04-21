import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/verify-otp',
  '/auth/reset-password',
  '/auth/new-password',
];

// Define role-specific routes
const sellerRoutes = ['/seller', '/listings/create', '/listings/edit'];
const adminRoutes = ['/admin'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // If no user and trying to access a protected route, redirect to login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user exists, get their profile to check roles and permissions
  if (user) {
    //Redirect to dashboard if already logged in

    if (request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, seller_status, is_admin, first_login')
      .eq('id', user.id)
      .single();

    // Redirect sellers trying to access seller routes if not approved
    if (
      profile &&
      sellerRoutes.some((route) => pathname.startsWith(route)) &&
      profile.role === 'seller' &&
      profile.seller_status !== 'approved'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect non-admins trying to access admin routes
    if (
      profile &&
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !profile.is_admin
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect first-time admin login to password change
    if (
      profile &&
      profile.is_admin &&
      profile.first_login === true &&
      pathname !== '/auth/new-password'
    ) {
      return NextResponse.redirect(new URL('/auth/new-password', request.url));
    }
  }

  return supabaseResponse;
}
