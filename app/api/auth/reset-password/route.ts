import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Find user by token first to distinguish between invalid and expired tokens
    const user = await prisma.user.findFirst({
      where: { resetToken: token }
    });

    if (!user) {
      await prisma.securityLog.create({
        data: {
          type: "PASSWORD_RESET_INVALID_TOKEN",
          email: "unknown",
          status: "failed",
          message: `Attempted password reset with invalid token: ${token}`
        }
      });
      return NextResponse.json({ error: "Invalid password reset token" }, { status: 400 });
    }

    // Check expiry
    const isExpired = user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date();
    if (isExpired) {
      await prisma.securityLog.create({
        data: {
          type: "PASSWORD_RESET_EXPIRED",
          email: user.email,
          userId: user.id,
          status: "failed",
          message: "Attempted password reset with expired token."
        }
      });
      return NextResponse.json({ error: "Expired password reset token" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    await prisma.securityLog.create({
      data: {
        type: "PASSWORD_RESET_COMPLETED",
        email: user.email,
        userId: user.id,
        status: "success",
        message: "Successfully reset password."
      }
    });

    return NextResponse.json({ ok: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
