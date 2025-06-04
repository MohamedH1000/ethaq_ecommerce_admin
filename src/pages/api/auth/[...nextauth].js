import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: { label: "name", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) {
          throw new Error("اسم المستخدم او كلمة المرور غير صحيحة");
        }

        const user = await prisma.user.findUnique({
          where: { name: credentials.name },
        });

        if (!user) {
          throw new Error("هذا المستخدم غير مسجل");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        return user; // Make sure to return the user object
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 60 * 60 * 24, // Session expiry duration (1 days)
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your environment
  callbacks: {
    async jwt({ token, user }) {
      // When the user signs in, we add the email to the JWT token
      if (user) {
        token.name = user.name; // Add email to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      // Add the email to the session object
      if (token?.name) {
        session.user.name = token.name;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
