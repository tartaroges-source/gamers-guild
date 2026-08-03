import type { NextAuthConfig } from 'next-auth';

// This is the "edge-safe" half of our auth setup. It contains no database
// calls and no bcrypt — neither can run in the Edge runtime that
// middleware.ts uses. Its only job is answering one question: given a
// request, is this visitor allowed to see this page?
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        // Not logged in and trying to reach the CMS -> bounce to /login.
        return isLoggedIn;
      }
      // Every other route (the public site) stays open to everyone.
      return true;
    },
  },
  // Left empty here on purpose — Credentials needs bcrypt + Prisma, which
  // only run in the full config (lib/auth/index.ts), not on the Edge.
  providers: [],
} satisfies NextAuthConfig;
