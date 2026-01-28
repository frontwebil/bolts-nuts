import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const { id, notes } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Order Id not Found" }, { status: 404 });
  }

  await prisma.order.update({
    where: {
      id: id,
    },
    data: {
      notes: notes,
    },
  });

  return NextResponse.json({ success: true });
}
