import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const successMessage = "If an account exists, a reset link has been generated.";

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    await prisma.securityLog.create({
      data: {
        type: "PASSWORD_RESET_REQUESTED",
        email: cleanEmail,
        userId: user?.id || null,
        status: "success",
        message: "Password reset requested."
      }
    });

    if (!user) {
      return NextResponse.json({
        ok: true,
        message: successMessage
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashResetToken(token);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: tokenHash,
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

    const showResetLink = process.env.NODE_ENV !== "production" && !emailSent;

    return NextResponse.json({
      ok: true,
      message: successMessage,
      resetUrl: showResetLink ? resetUrl : undefined
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
