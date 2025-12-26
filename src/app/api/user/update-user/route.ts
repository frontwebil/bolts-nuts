import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const data = await req.json();

  console.log(data);

  if (!data) {
    return NextResponse.json({ error: "Data not found" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...data,
    },
    select: {
      name: true,
      surname: true,
      phoneNumber: true,
      email: true,
      favoriteProducts: true,
    },
  });

  return NextResponse.json(
    { message: "User data updated", updatedUser },
    { status: 200 }
  );
}
