import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

function planNameFromInput(plan?: string) {
  const normalized = (plan || "starter").toLowerCase();
  if (normalized === "business") return "Business";
  if (normalized === "growth" || normalized === "pro") return "Pro";
  return "Starter";
}

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const selectedPlan = await prisma.plan.findUnique({ where: { name: planNameFromInput(input.plan) } });
    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash: await hashPassword(input.password),
        role: Role.CUSTOMER,
        planId: selectedPlan?.id,
        subscriptionStatus: "active"
      }
    });
    await createSession(user);
    return NextResponse.json({ ok: true, role: user.role, redirectTo: "/dashboard" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
  }
}
