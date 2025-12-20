import prisma from "@/lib/prisma";
import { encode } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ isValidToken: false });
  }

  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
  });

  if (!user) {
    return NextResponse.json({ isValidToken: false });
  }

  if (
    user.resetToken &&
    user.resetTokenExpiry &&
    Date.now() > user.resetTokenExpiry.getTime()
  ) {
    return NextResponse.json({ isValidToken: false });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyExpiry: null,
      emailVerifyToken: null,
      isVerified: true,
    },
  });

  const sessionToken = await encode({
    token: {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
    },
    secret: authOptions.secret!,
  });

  (await cookies()).set(
    process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "next-auth.session-token",
    sessionToken,
    {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 днів
    }
  );

  return NextResponse.json({
    isValidToken: true,
    email: user.email,
  });
}
