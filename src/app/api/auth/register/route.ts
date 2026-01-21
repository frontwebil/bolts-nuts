import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "@/lib/nodemailer/sendmail";

export async function POST(req: Request) {
  try {
    const { name, surname, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required!",
        },
        {
          status: 400,
        }
      );
    }

    if (!name || !surname) {
      return NextResponse.json(
        {
          error: "First name and last name are required!",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "This email is already registered!",
        },
        {
          status: 409,
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        surname,
        isVerified: false,
        emailVerifyToken: token,
        emailVerifyExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 год
        favoriteProducts: [],
      },
      select: {
        id: true,
        email: true,
      },
    });

    // const baseUrl = "http://localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/verify-email/${token}`;

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
        Confirm your email
      </h1>
    </div>

    <div style="padding: 32px;">
      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        color: #1f2937;
      ">
        Welcome to Clave!
      </p>

      <p style="
        margin: 0 0 28px;
        font-size: 14px;
        color: #6b7280;
      ">
        Please confirm your email address to activate your account.
      </p>

      <div style="text-align: center;">
        <a href="${verifyLink}" style="
          display: inline-block;
          background: #ff5a00;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
        ">
          Confirm email
        </a>
      </div>

      <p style="
        margin-top: 28px;
        font-size: 13px;
        color: #9ca3af;
      ">
        If you didn't create an account, just ignore this email.
      </p>
    </div>

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
      to: email,
      subject: "Confirm your Clave account",
      html,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
