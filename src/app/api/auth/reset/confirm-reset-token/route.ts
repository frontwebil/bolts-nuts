import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password, token } = await req.json();

    console.log(password, token);
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
