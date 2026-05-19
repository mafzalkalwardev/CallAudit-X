import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultCategories, plans } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export async function ensureDemoData() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({ where: { name: category.name }, update: category, create: category });
  }
  for (const plan of plans) {
    await prisma.plan.upsert({ where: { name: plan.name }, update: plan, create: plan });
  }
}

export async function getOrCreateDemoCustomer() {
  await ensureDemoData();
  const starter = await prisma.plan.findUnique({ where: { name: "Starter" } });
  return prisma.user.upsert({
    where: { email: "customer@callauditx.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@callauditx.com",
      passwordHash: await hash("Customer123!", 12),
      role: Role.CUSTOMER,
      subscriptionStatus: "active",
      planId: starter?.id
    }
  });
}
