import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Id not found" }, { status: 404 });

  try {
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Order not found or already deleted" },
      { status: 500 },
    );
  }
}
