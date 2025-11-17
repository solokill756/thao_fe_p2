import { NextAuthOptions, DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUserFromGoogle } from './services/userService';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          console.log('[AUTH] Attempting to authenticate:', credentials.email);
          const user = await getUserByEmail(credentials.email);

          if (!user) {
            console.log('[AUTH] User not found:', credentials.email);
            return null;
          }

          if (!user.password_hash) {
            console.log('[AUTH] User has no password hash:', credentials.email);
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isValidPassword) {
            console.log('[AUTH] Invalid password for user:', credentials.email);
            return null;
          }

          console.log(
            '[AUTH] Authentication successful for:',
            credentials.email
          );
          return {
            id: user.user_id.toString(),
            name: user.full_name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const email = user.email;
          if (!email) {
            console.log('[AUTH] Google account missing email');
            return false;
          }

          const existingUser = await getUserByEmail(email);

          if (!existingUser) {
            const providerId = account.providerAccountId;
            const fullName = user.name || email.split('@')[0];
            const avatarUrl = user.image || undefined;

            console.log('[AUTH] Creating new user from Google:', email);
            const newUser = await createUserFromGoogle(
              fullName,
              email,
              providerId,
              avatarUrl
            );

            user.id = newUser.user_id.toString();
            user.role = newUser.role;
          } else {
            user.id = existingUser.user_id.toString();
            user.role = existingUser.role;
          }

          return true;
        } catch (error) {
          console.error('[AUTH] Error in Google signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString() ?? '';
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id?.toString() ?? '';
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};
