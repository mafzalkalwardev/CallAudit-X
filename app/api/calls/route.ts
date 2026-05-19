import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  const calls = await prisma.call.findMany({
    where: session?.role === Role.ADMIN ? {} : { userId: session?.id || demoUser!.id },
    include: { report: { include: { category: true } }, verification: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(calls);
}
