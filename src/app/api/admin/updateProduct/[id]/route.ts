/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function makeUniqueSlug(base: string, excludeProductId?: string) {
  let slug = base;
  let i = 1;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) return slug;
    if (excludeProductId && existing.id === excludeProductId) return slug;

    i++;
    slug = `${base}-${i}`;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { options: true, specs: true },
    });

    if (!existing)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const body = await req.json();

    const {
      title,
      description,
      anotherInfo,
      productGroup,
      category,
      isActive,
      isBestSeller,
      inStock,
      brandName,
      images,
      options,
      specs,
      technicalImg,
    } = body;

    // валідації (аналогічно POST, але anotherInfo можеш зробити НЕ required якщо хочеш)
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Якщо хочеш anotherInfo обовʼязковим як у POST:
    // if (!anotherInfo?.trim()) ...

    if (!Array.isArray(options) || options.length === 0) {
      return NextResponse.json({ error: "Options required" }, { status: 400 });
    }

    const mainCount = options.filter((o: any) => o.isMain).length;
    if (mainCount !== 1)
      return NextResponse.json(
        { error: "Set exactly one main option" },
        { status: 400 }
      );

    const badPrice = options.some((o: any) => Number(o.price) <= 0);
    if (badPrice)
      return NextResponse.json(
        { error: "Each option must have price > 0" },
        { status: 400 }
      );

    // slug: міняємо тільки якщо змінився title
    let slug = existing.slug;
    const nextTitle = title.trim();
    if (nextTitle !== existing.title) {
      const baseSlug = slugify(nextTitle);
      slug = await makeUniqueSlug(baseSlug, id);
    }

    // update + replace options/specs
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: nextTitle,
        description: description.trim(),
        anotherInfo: (anotherInfo ?? "").trim(),
        productGroup: (productGroup ?? "").trim(),
        brandName: (brandName ?? "").trim(),
        technicalImg: (technicalImg ?? "").trim(),
        category: category.trim(),
        slug,

        isActive: Boolean(isActive),
        isBestSeller: Boolean(isBestSeller),
        inStock: Boolean(inStock),

        images: Array.isArray(images) ? images : [],

        // повністю заміняємо
        options: {
          deleteMany: {},
          create: options.map((o: any) => ({
            label: o.label,
            value: o.value || null,
            price: Number(o.price),
            discount: o.discount ? Number(o.discount) : null,
            unit: o.unit || null,
            isMain: Boolean(o.isMain),
            inStock: Boolean(o.inStock),
          })),
        },

        specs: {
          deleteMany: {},
          create: (specs || [])
            .filter((s: any) => s.value?.trim())
            .map((s: any) => ({
              group: s.group,
              key: s.key,
              value: s.value.trim(),
            })),
        },
      },
      include: { options: true, specs: true },
    });

    return NextResponse.json({ product: updated }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
