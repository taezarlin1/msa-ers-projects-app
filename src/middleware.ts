// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };


import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Authentication middleware that runs BEFORE internationalization
function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('=== Auth Middleware Debug ===');
  console.log('Pathname:', pathname);
  console.log('All cookies:', request.cookies.getAll());

  // Skip auth check for these paths
  const publicPaths = [
    '/authorization',
    '/api/authorization',
    '/api/login',
    '/api/signup',
    '/api/init-db',
    '/api/test-auth',
    '/api/verify-token'
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path =>
    pathname.includes(path)
  ) || pathname.startsWith('/_next') || pathname.startsWith('/api');

  console.log('Is public path:', isPublicPath);

  if (isPublicPath) {
    console.log('Skipping auth check for public path');
    return null; // Continue to next middleware
  }

  // Get token from cookies
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;
  // console.log('Token cookie object:', tokenCookie);
  // console.log('Token exists:', !!token);
  // console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');

  // If no token, redirect to authorization
  if (!token) {
    console.log("No token - redirecting to authorization");
    const url = request.nextUrl.clone();
    // Redirect to authorization with default locale
    url.pathname = '/en/authorization';
    return NextResponse.redirect(url);
  }

  // For now, just check if token has valid JWT format (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log("Invalid token format - redirecting to authorization");
    const url = request.nextUrl.clone();
    url.pathname = '/en/authorization';
    return NextResponse.redirect(url);
  }

  console.log("Token format is valid - allowing access");

  return null; // Continue to next middleware
}

// Combined middleware function
export default function middleware(request: NextRequest) {
  // First, check authentication
  const authResult = authMiddleware(request);
  if (authResult) {
    return authResult;
  }

  // Then, apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

