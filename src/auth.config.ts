import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: {},
        name: {},
        username: {},
        email: {},
        accessToken: {},
      },
      // @ts-expect-error - CredentialsProvider is not typed
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            id: z.string(),
            name: z.string(),
            username: z.string(),
            email: z.string(),
            accessToken: z.string(),
          })
          .safeParse(credentials);
        if (!parsedCredentials.success) return null;
        return { ...parsedCredentials.data, emailVerified: null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name as string;
        token.username = user.username;
        token.email = user?.email as string;
        token.accessToken = user.accessToken;
        token.emailVerified = user.emailVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.accessToken = token.accessToken as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
