import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: "Invalid addressId" }, { status: 400 });
    }

    // Перевірка: адреса належить цьому юзеру
    const address = await prisma.address.findFirst({
      where: { id: String(addressId), userId: session.user.id },
      select: { id: true },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { mainAddressId: String(addressId) }, // ✅ ОЦЕ ГОЛОВНЕ
    });

    return NextResponse.json({ ok: true, mainAddressId: addressId });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
