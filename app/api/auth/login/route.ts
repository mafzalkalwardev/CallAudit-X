import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { ensureDemoLogin } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    let user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user && email !== input.email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      user = await ensureDemoLogin(email, input.password);
    }
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    if (user.subscriptionStatus === "inactive") {
      return NextResponse.json({ error: "This account is inactive. Contact an administrator to restore access." }, { status: 403 });
    }
    await createSession(user);
    return NextResponse.json({ ok: true, role: user.role, redirectTo: user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard" });
  } catch {
    return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
  }
}
