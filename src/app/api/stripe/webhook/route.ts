/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/nodemailer/sendmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  switch (event.type) {
    // ✅ Успешная оплата
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) break;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          paymentIntentId: session.payment_intent as string,
          paidAt: new Date(),
        },
        select: {
          email: true,
          name: true,
          surname: true,
        },
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const cabinetLink = `${baseUrl}/account/orders`;

      const fullName = `${order.name} ${order.surname}`;

      const html = `
<div style="
font-family: Inter, Arial, sans-serif;
background: #f8fafc;
padding: 40px;
">
<div style="
max-width: 520px;
margin: auto;
background: #ffffff;
border-radius: 16px;
box-shadow: 0 10px 30px rgba(0,0,0,0.08);
overflow: hidden;
">


<!-- Header -->
<div style="
background: linear-gradient(90deg, #ff5a00, #ff7a18);
padding: 28px;
text-align: center;
">
<h1 style="
margin: 0;
color: #ffffff;
font-size: 22px;
font-weight: 700;
letter-spacing: 0.3px;
">
Payment successful
</h1>
</div>


<!-- Body -->
<div style="padding: 32px;">
<p style="
margin: 0 0 16px;
font-size: 15px;
color: #1f2937;
">
Hello ${fullName},
</p>


<p style="
margin: 0 0 20px;
font-size: 14px;
color: #6b7280;
line-height: 1.6;
">
We are pleased to inform you that your payment was completed successfully.
</p>


<p style="
margin: 0 0 28px;
font-size: 14px;
color: #6b7280;
line-height: 1.6;
">
You can now find your order in your personal cabinet using the email address
you provided when placing the order.
</p>


<div style="text-align: center;">
<a href="${cabinetLink}" style="
display: inline-block;
background: #ff5a00;
color: #ffffff;
padding: 14px 32px;
border-radius: 8px;
text-decoration: none;
font-size: 15px;
font-weight: 600;
">
Go to my account
</a>
</div>


<p style="
margin-top: 28px;
font-size: 13px;
color: #9ca3af;
line-height: 1.6;
">
If you have any questions regarding your order, simply reply to this email —
our support team will be happy to assist you.
</p>
</div>


<!-- Footer -->
<div style="
background: #f1f5f9;
padding: 18px;
text-align: center;
">
<p style="
margin: 0;
font-size: 12px;
color: #64748b;
">
© ${new Date().getFullYear()} Clave. All rights reserved.
</p>
</div>


</div>
</div>
`;

      await sendMail({
        to: order.email, // пошта з замовлення
        subject: "Your payment was successful",
        html,
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
          status: "expired",
        },
      });

      console.log("⚠️ Order expired (session expired):", orderId);
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
