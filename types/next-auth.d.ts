import type { DefaultSession } from 'next-auth';

// Auth.js's default Session/User types have no idea our database has a
// `role` column. This file "teaches" TypeScript about it, so
// `session.user.role` autocompletes and type-checks everywhere in the
// app, instead of being `any` or a type error.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'OFFICER';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'ADMIN' | 'OFFICER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'OFFICER';
  }
}
