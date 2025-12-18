import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  if (!token) {
    return NextResponse.json({ isValidToken: false });
  }

  const user = await prisma.user.findFirst({
    where: { resetToken: hashedToken },
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

  return NextResponse.json({ isValidToken: true });
}
