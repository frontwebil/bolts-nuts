import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc", // 🔥 новіші спочатку
      },
      include: {
        specs: true,
        options: true,
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (_) {
    return NextResponse.json({ error: "Помилка серверу" }, { status: 500 });
  }
}
