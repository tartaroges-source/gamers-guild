import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

// This only uses the edge-safe config — no database calls happen here,
// just a check of the signed session cookie on incoming requests.
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ['/dashboard/:path*'],
};
