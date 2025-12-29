/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { Readable } from "stream";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Not allowed request!" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null; // ✅ 1 файл

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const MAX_MB = 6;
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `The file is too large (max ${MAX_MB}MB)` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = bufferToStream(buffer);

    const uploaded = await new Promise<any>((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          format: "webp", // ✅ конвертуємо в webp
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      stream.pipe(cloudStream);
    });

    return NextResponse.json({ url: uploaded.secure_url }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Download Error" }, { status: 500 });
  }
}
