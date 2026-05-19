import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      // For security reasons, don't confirm or deny user existence in production,
      // but in dev/test mode let's be explicit to make it easy.
      return NextResponse.json({ error: "User with this email was not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    });

    // Output URL link
    const resetUrl = `${process.env.NEXTPUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    return NextResponse.json({
      ok: true,
      message: "Reset token generated successfully",
      resetUrl,
      token
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process forgot password request" }, { status: 500 });
  }
}
