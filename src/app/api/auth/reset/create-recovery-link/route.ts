import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendMail } from "@/lib/nodemailer/sendmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: "Reset link has been sent if the email exists",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const expiryDate = new Date(Date.now() + 3600 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiryDate,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/recovery/${token}`;

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
        Password recovery
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #1f2937;
      ">
        We received a request to reset your password.
      </p>

      <p style="
        margin: 0 0 28px;
        font-size: 14px;
        color: #6b7280;
      ">
        Click the button below to set a new password.
      </p>

      <div style="text-align: center;">
        <a href="${resetLink}" style="
          display: inline-block;
          background: #ff5a00;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
        ">
          Reset password
        </a>
      </div>

      <p style="
        margin-top: 28px;
        font-size: 13px;
        color: #9ca3af;
      ">
        If you didn’t request a password reset, you can safely ignore this email.
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
        © ${new Date().getFullYear()} Bolts & Nuts. All rights reserved.
      </p>
    </div>

  </div>
</div>
`;

    await sendMail({
      to: user.email,
      subject: "Reset Password",
      html,
    });

    return NextResponse.json({
      message: "Reset link has been sent if the email exists",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
