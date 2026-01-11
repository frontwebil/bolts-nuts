import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Not authorize" }, { status: 401 });
  }

  const userFavorite = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  return NextResponse.json({
    favoriteProducts: userFavorite?.favoriteProducts,
  });
}
