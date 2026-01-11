import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favoriteProducts: true },
    });

    const favorites = user?.favoriteProducts ?? [];

    const { productId } = await req.json();

    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { favoriteProducts: newFavorites },
      select: { favoriteProducts: true },
    });

    return NextResponse.json(
      {
        message: "Favorites updated",
        favoriteProducts: updatedUser.favoriteProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
