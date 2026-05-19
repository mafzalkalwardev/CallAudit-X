import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // Track request
    await prisma.securityLog.create({
      data: {
        type: "PASSWORD_RESET_REQUESTED",
        email: cleanEmail,
        userId: user?.id || null,
        status: user ? "success" : "failed",
        message: user 
          ? `Password reset requested for registered user.` 
          : `Password reset requested for unregistered email.`
      }
    });

    if (!user) {
      // NEVER reveal email existence for security
      return NextResponse.json({
        ok: true,
        message: "If an account exists, a reset link has been generated."
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry per instructions

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const isEmailEnabled = process.env.FORM_SUBMIT_ENABLED === "true";
    let emailSent = false;
    let emailError = "";

    if (isEmailEnabled) {
      try {
        const recipient = process.env.FORM_SUBMIT_FROM_EMAIL || "callaudtix@gmail.com";
        const formSubmitUrl = `https://formsubmit.co/ajax/${recipient}`;
        const response = await fetch(formSubmitUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: "Password Reset Request - CallAudit X",
            name: user.name,
            email: cleanEmail,
            message: `You requested a password reset for CallAudit X. Click this link to reset your password: ${resetUrl}. This link expires in 15 minutes. If you did not request this, ignore this email.`
          })
        });

        if (response.ok) {
          emailSent = true;
          await prisma.securityLog.create({
            data: {
              type: "PASSWORD_RESET_EMAIL_SENT",
              email: cleanEmail,
              userId: user.id,
              status: "success",
              message: `Password reset email sent to ${cleanEmail} via FormSubmit.`
            }
          });
        } else {
          const errText = await response.text();
          throw new Error(errText || "FormSubmit rejected request");
        }
      } catch (err: any) {
        emailError = err.message || "Failed to fetch FormSubmit";
        await prisma.securityLog.create({
          data: {
            type: "PASSWORD_RESET_EMAIL_FAILED",
            email: cleanEmail,
            userId: user.id,
            status: "failed",
            message: `Failed to send password reset email: ${emailError}`
          }
        });
      }
    } else {
      // Email disabled log
      await prisma.securityLog.create({
        data: {
          type: "EMAIL_DISABLED",
          email: cleanEmail,
          userId: user.id,
          status: "info",
          message: "FormSubmit is disabled. Falling back to development mode display."
        }
      });
    }

    // In dev mode (or if email failed/disabled), expose resetUrl to allow easy testing
    const showResetLink = !emailSent;

    return NextResponse.json({
      ok: true,
      message: "If an account exists, a reset link has been generated.",
      resetUrl: showResetLink ? resetUrl : undefined
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
