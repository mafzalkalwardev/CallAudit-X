import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const starter = await prisma.plan.findUnique({ where: { name: "Starter" } });
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password), role: Role.CUSTOMER, planId: starter?.id }
    });
    await createSession(user);
    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
  }
}
