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

async function makeUniqueSlug(base: string) {
  let slug = base;
  let i = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    i++;
    slug = `${base}-${i}`;
  }

  return slug;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const body = await req.json();

    const {
      title,
      description,
      productGroup,
      anotherInfo,
      category,
      isActive,
      isBestSeller,
      inStock,
      images,
      options,
      specs,
    } = body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !anotherInfo?.trim()
    )
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );

    if (!Array.isArray(options) || options.length === 0)
      return NextResponse.json({ error: "Options required" }, { status: 400 });

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

    const baseSlug = slugify(title);
    const slug = await makeUniqueSlug(baseSlug);

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        anotherInfo: anotherInfo.trim(),
        productGroup: productGroup.trim(),
        slug,
        category: category.trim(),
        isActive: Boolean(isActive),
        isBestSeller: Boolean(isBestSeller),
        inStock: Boolean(inStock),
        images,

        options: {
          create: options.map((o: any) => ({
            label: o.label,
            value: o.value || null,
            price: o.price,
            discount: o.discount || null,
            unit: o.unit || null,
            isMain: o.isMain,
            inStock: o.inStock,
          })),
        },

        specs: {
          create: (specs || [])
            .filter((s: any) => s.value?.trim())
            .map((s: any) => ({
              group: s.group,
              key: s.key,
              value: s.value,
            })),
        },
      },
      include: { options: true, specs: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
