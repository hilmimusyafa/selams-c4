// @ts-nocheck - Auth types will work after setup
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware untuk update user session dan protect routes
 * Gunakan di middleware.ts di root project
 */
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
          cookiesToSet.forEach(({ name, value, options }) =>
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes yang tidak perlu authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Jika user tidak login dan mencoba akses protected route
  if (!user && !isPublicRoute && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Jika user sudah login dan mencoba akses login/register, redirect ke dashboard
  if (user && isPublicRoute) {
    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();
    
    if (profile?.role === 'teacher') {
      url.pathname = '/teacher/dashboard';
    } else {
      url.pathname = '/student/dashboard';
    }
    
    return NextResponse.redirect(url);
  }

  // Check role-based access
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Teacher trying to access student routes
    if (profile?.role === 'teacher' && pathname.startsWith('/student')) {
      const url = request.nextUrl.clone();
      url.pathname = '/teacher/dashboard';
      return NextResponse.redirect(url);
    }

    // Student trying to access teacher routes
    if (profile?.role === 'student' && pathname.startsWith('/teacher')) {
      const url = request.nextUrl.clone();
      url.pathname = '/student/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
