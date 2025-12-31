import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

function getCloudinaryPublicId(url: string) {
  // прибираємо query string
  const clean = url.split("?")[0];

  // знаходимо сегмент після "/upload/"
  const idx = clean.indexOf("/upload/");
  if (idx === -1) return null;

  // частина після /upload/
  let tail = clean.slice(idx + "/upload/".length);

  // інколи там є трансформації типу "c_fill,w_400/...". Заберемо їх:
  // трансформації завжди до наступного "/" і містять коми/підкреслення/числа
  // Простий трюк: якщо перший сегмент містить "," або "_" або "w_" "c_" — вважаємо трансформаціями.
  const parts = tail.split("/");
  if (parts.length >= 2) {
    const first = parts[0];
    const looksLikeTransform =
      first.includes(",") ||
      first.includes("_") ||
      first.startsWith("c_") ||
      first.startsWith("w_") ||
      first.startsWith("h_") ||
      first.startsWith("q_") ||
      first.startsWith("f_");

    if (looksLikeTransform) {
      parts.shift();
      tail = parts.join("/");
    }
  }

  // прибираємо версію типу v1700000000/
  tail = tail.replace(/^v\d+\//, "");

  // прибираємо розширення
  tail = tail.replace(/\.[a-zA-Z0-9]+$/, "");

  // tail = "products/abc123" або "products/folder/abc123"
  return tail;
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Id not found" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const images = Array.isArray(product.images) ? product.images : [];

    await Promise.allSettled(
      images.map((url) => {
        const publicId = getCloudinaryPublicId(url);
        if (!publicId) return Promise.resolve(null);
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await prisma.$transaction([
      prisma.spec.deleteMany({ where: { productId: id } }),
      prisma.option.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (err) {
    console.error("Error in Delete:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
