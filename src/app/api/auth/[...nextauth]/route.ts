import prisma from "@/lib/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { sendMail } from "@/lib/nodemailer/sendmail";
import crypto from "crypto";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "user-login",
      name: "User login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            password: true,
            isVerified: true,
            phoneNumber: true,
          },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        if (!user.isVerified) {
          const token = crypto.randomBytes(32).toString("hex");

          await prisma.user.update({
            where: { id: user.id },
            data: {
              emailVerifyToken: token,
              emailVerifyExpiry: new Date(Date.now() + 1000 * 60 * 60),
            },
          });

          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          const verifyLink = `${baseUrl}/verify-email/${token}`;

          const html = `
          <div style="
            font-family: Inter, Arial, sans-serif;
            background: #f8fafc;
            padding: 40px;
          ">
            <div style="
              max-width: 520px;
              margin: auto;
              background: #ffffff;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
              overflow: hidden;
            ">
          
              <div style="
                background: linear-gradient(90deg, #ff5a00, #ff7a18);
                padding: 28px;
                text-align: center;
              ">
                <h1 style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 22px;
                  font-weight: 700;
                  letter-spacing: 0.3px;
                ">
                  Confirm your email
                </h1>
              </div>
          
              <div style="padding: 32px;">
                <p style="
                  margin: 0 0 16px;
                  font-size: 15px;
                  color: #1f2937;
                ">
                  Welcome to Bolts & Nuts!
                </p>
          
                <p style="
                  margin: 0 0 28px;
                  font-size: 14px;
                  color: #6b7280;
                ">
                  Please confirm your email address to activate your account.
                </p>
          
                <div style="text-align: center;">
                  <a href="${verifyLink}" style="
                    display: inline-block;
                    background: #ff5a00;
                    color: #ffffff;
                    padding: 14px 32px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: 600;
                  ">
                    Confirm email
                  </a>
                </div>
          
                <p style="
                  margin-top: 28px;
                  font-size: 13px;
                  color: #9ca3af;
                ">
                  If you didn't create an account, just ignore this email.
                </p>
              </div>
          
              <div style="
                background: #f1f5f9;
                padding: 18px;
                text-align: center;
              ">
                <p style="
                  margin: 0;
                  font-size: 12px;
                  color: #64748b;
                ">
                  © ${new Date().getFullYear()} Bolts & Nuts. All rights reserved.
                </p>
              </div>
          
            </div>
          </div>
          `;

          await sendMail({
            to: user.email,
            subject: "Confirm your Bolts & Nuts account",
            html,
          });

          throw new Error("Email not verified");
        }

        return {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phoneNumber: user.phoneNumber ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.surname = user.surname;
        token.phoneNumber = user.phoneNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.surname = token.surname as string;
        session.user.phoneNumber = token.phoneNumber as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
