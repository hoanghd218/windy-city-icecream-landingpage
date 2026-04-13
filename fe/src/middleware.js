// Protects /admin and /api/admin routes with HTTP Basic Auth.
// Single admin credential from ADMIN_PASSWORD env var.

import { NextResponse } from 'next/server';

const ADMIN_USERNAME = 'admin';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Windy City Admin", charset="UTF-8"',
      'cache-control': 'no-store',
    },
  });
}

export function middleware(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return unauthorized();

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) return unauthorized();

  let user, pass;
  try {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(':');
    user = decoded.slice(0, idx);
    pass = decoded.slice(idx + 1);
  } catch {
    return unauthorized();
  }
  if (user !== ADMIN_USERNAME || pass !== adminPassword) return unauthorized();

  const res = NextResponse.next();
  res.headers.set('x-robots-tag', 'noindex, nofollow');
  res.headers.set('cache-control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
