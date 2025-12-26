import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
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

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        country: String(country).trim(),
        addressLine: String(addressLine).trim(),
        city: String(city).trim(),
        province: String(province).trim(),
        postalCode: String(postalCode).trim(),
        company: company ? String(company).trim() : null,
        apartment: apartment ? String(apartment).trim() : null,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { mainAddressId: address.id },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
