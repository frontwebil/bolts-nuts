import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/nodemailer/sendmail";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const data = await req.json();
  const oldOrder = await prisma.order.findUnique({ where: { id: data.id } });
  if (!oldOrder)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (!data) {
    return NextResponse.json({ error: "Data not found" }, { status: 404 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: data.id },
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phoneNumber: data.phoneNumber,

      status: data.status,
      orderStatus: data.orderStatus,

      deliveryTrackNumber:
        data.orderStatus === "Order Shipped" ? data.deliveryTrackNumber : null,

      deliveryLink:
        data.orderStatus === "Order Shipped" ? data.deliveryLink : null,

      shippingPrice: data.shippingPrice,
      notes: data.notes,

      address: {
        city: data.city,
        address: data.address,
        postalCode: data.postalCode,
        province: data.province,
        company: data.company,
        shippingName: data.shippingName,
      },
    },
  });

  const orderStatusChanged = oldOrder.orderStatus !== data.orderStatus;

  if (orderStatusChanged) {
    if (updatedOrder.status == "New Order") {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const cabinetLink = `${baseUrl}/account/orders`;

      const fullName = `${updatedOrder.name} ${updatedOrder.surname}`;
      const supportPhone = "+1 (800) 123-45-67";

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
      margin: 0 0 12px;
      font-size: 14px;
      color: #374151;
      ">
      <strong>Order ID:</strong> ${updatedOrder}
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
      <p style="
      margin: 0 0 24px;
      font-size: 14px;
      color: #374151;
      ">
      <strong>Support phone:</strong> ${supportPhone}
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
        to: updatedOrder.email, // пошта з замовлення
        subject: "Your payment was successful",
        html,
      });
      console.log("Email Sent")
    }
  }

  return NextResponse.json({ ok: true });
}
