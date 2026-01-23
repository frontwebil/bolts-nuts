/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    // ✅ Успешная оплата
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) break;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          paymentIntentId: session.payment_intent as string,
          paidAt: new Date(),
        },
      });

      console.log("✅ Order paid:", orderId);
      break;
    }

    // ❌ Пользователь закрыл окно / сессия истекла
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) break;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "cancelled",
        },
      });

      console.log("⚠️ Order cancelled (session expired):", orderId);
      break;
    }

    // ❌ Платёж не прошёл (карта отклонена и т.д.)
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;

      // Ищем order по paymentIntentId
      await prisma.order.updateMany({
        where: {
          paymentIntentId: intent.id,
        },
        data: {
          status: "failed",
        },
      });

      console.log("❌ Payment failed:", intent.id);
      break;
    }

    default: {
      console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true });
}
