import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: { mainAddressId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json(
        { error: "Address id required" },
        { status: 400 }
      );
    }

    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    if (user?.mainAddressId === addressId) {
      const newMain = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { id: "asc" },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          mainAddressId: newMain?.id || null,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
