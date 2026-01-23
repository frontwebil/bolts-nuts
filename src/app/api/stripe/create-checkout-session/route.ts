import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const { items, shippingPrice, gstHst } = await req.json();

  // Преобразуем все товары в line_items
  const line_items = items.map((item: any) => ({
    price_data: {
      currency: "usd",
      unit_amount: Math.round(item.price * 100), // в центах
      product_data: {
        name: `${item.product.title} , (${item.variant.value} ${item.variant.unit ?? ""})`,
        images: [item.product.images[0]], // фото
      },
    },
    quantity: item.quantity,
  }));

  // Добавляем shipping как отдельный line_item
  if (shippingPrice) {
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(shippingPrice * 100),
        product_data: {
          name: "Shipping",
        },
      },
      quantity: 1,
    });
  }

  // Можно добавить gstHst как отдельный line_item
  if (gstHst) {
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(gstHst * 100),
        product_data: {
          name: "Tax / GST",
        },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  });

  return NextResponse.json({ url: session.url });
}
