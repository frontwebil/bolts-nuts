/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const {
    items,
    shippingPrice,
    gstHst,
    shippingName,
    shippingAddress,
    userData,
    subTotal,
  } = await req.json();

  const safeShipping = Number(shippingPrice || 0);
  const safeTax = Number(gstHst || 0);

  // Stripe line_items
  const line_items = items.map((item: any) => ({
    price_data: {
      currency: "usd",
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: item.product?.title
          ? `${item.product.title}, (${item.variant.value} ${item.variant.unit ?? ""})`
          : "Product",
        images: item.product?.images?.[0] ? [item.product.images[0]] : [],
      },
    },
    quantity: item.quantity,
  }));

  if (safeShipping > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(safeShipping * 100),
        product_data: {
          name: shippingName || "Shipping",
        },
      },
      quantity: 1,
    });
  }

  if (safeTax > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(safeTax * 100),
        product_data: {
          name: "Tax / GST",
        },
      },
      quantity: 1,
    });
  }

  // 1. СНАЧАЛА создаём Stripe Session

  // Snapshot items
  const itemsSnapshot = items.map((item: any) => ({
    productId: item.variant.productId,
    title: item.product.title,
    slug: item.product.slug,
    imagesUrl: item.product.images,

    quantity: item.quantity,
    price: item.price,

    variant: {
      label: item.variant.label,
      value: item.variant.value,
      unit: item.variant.unit,
      inStock: item.variant.inStock,
      isMain: item.variant.isMain,
    },

    specs: item.product.specs.map((s: any) => ({
      key: s.key,
      value: s.value,
      group: s.group,
    })),
  }));

  const order = await prisma.order.create({
    data: {
      status: "pending",
      items: itemsSnapshot,

      subtotal: subTotal,
      shippingPrice: safeShipping,
      taxPrice: safeTax,
      total: subTotal + safeShipping + safeTax,

      email: userData.email,
      phoneNumber: userData.phoneNumber,
      name: userData.name,
      surname: userData.surname,

      address: { ...shippingAddress, shippingName: shippingName },
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    metadata: {
      orderId: order.id, // ✅ теперь metadata сразу содержит orderId
    },
  });

  return NextResponse.json({ url: session.url });
}

