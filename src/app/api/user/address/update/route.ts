import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await req.json();

    const {
      id,
      country,
      addressLine,
      city,
      province,
      postalCode,
      company,
      apartment,
    } = data;

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    if (!country || !addressLine || !city || !province || !postalCode) {
      return NextResponse.json(
        {
          error:
            "country, addressLine, city, province and postalCode are required",
        },
        { status: 400 }
      );
    }

    await prisma.address.update({
      where: { id },
      data: {
        country,
        addressLine,
        city,
        province,
        postalCode,
        company: company ?? null,
        apartment: apartment ?? null,
      },
    });

    return NextResponse.json({ ok: true, status: 201 });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
