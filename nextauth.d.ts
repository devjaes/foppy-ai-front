import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      accessToken: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    name: string;
    username: string;
    accessToken: string;
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    accessToken?: string;
    emailVerified?: Date | null;
  }
}
