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
<p style="
margin: 0 0 12px;
font-size: 15px;
color: #111827;
">
Hello ${fullName},
</p>


<p style="
margin: 0 0 18px;
font-size: 14px;
color: #374151;
line-height: 1.6;
">
We’re happy to inform you that your payment has been successfully processed.
</p>


<div style="
background: #f9fafb;
border: 1px solid #e5e7eb;
border-radius: 10px;
padding: 16px 18px;
margin-bottom: 24px;
">
<p style="
margin: 0 0 6px;
font-size: 13px;
color: #6b7280;
">
Order status
</p>
<p style="
margin: 0;
font-size: 14px;
font-weight: 600;
color: #16a34a;
">
Paid
</p>
</div>


<p style="
margin: 0 0 22px;
font-size: 14px;
color: #374151;
line-height: 1.6;
">
You can view the details of your order in your personal account using the email address
you provided when placing the order.
</p>


<div style="text-align: center; margin-bottom: 24px;">
<a href="${cabinetLink}" style="
display: inline-block;
background: #16a34a;
color: #ffffff;
padding: 13px 30px;
border-radius: 8px;
text-decoration: none;
font-size: 14px;
font-weight: 600;
">
View my orders
</a>
</div>


<p style="
margin: 0;
font-size: 13px;
color: #6b7280;
line-height: 1.6;
">
If you have any questions about your order, simply reply to this email and our support team
will be happy to assist you.
</p>
</div>


<!-- Footer -->
<div style="
background: #f9fafb;
padding: 18px;
text-align: center;
border-top: 1px solid #e5e7eb;
">
<p style="
margin: 0;
font-size: 12px;
color: #9ca3af;
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
