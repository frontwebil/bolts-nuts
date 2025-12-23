import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const data = await req.json();

  if (!data) {
    return NextResponse.json({ error: "Data not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
