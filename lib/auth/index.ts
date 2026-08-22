import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // JWT sessions: the session data lives in a signed cookie, not a
  // database row. We don't need database-backed sessions (no "log out
  // this device remotely" requirement for a club site), so this is
  // simpler and needs no extra tables.
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Deliberately vague on failure — we don't reveal whether the
        // email exists or the password was wrong. That distinction is a
        // gift to anyone trying to guess valid accounts.
        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
           image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // The JWT callback runs when the token is created/updated. We copy
    // the role and id onto the token so they're available later without
    // another database query.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    // The session callback shapes what `auth()` returns to our app code.
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'ADMIN' | 'OFFICER';
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
