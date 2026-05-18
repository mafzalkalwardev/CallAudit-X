import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const calls = await prisma.call.findMany({
    where: session.role === Role.ADMIN ? {} : { userId: session.id },
    include: { report: { include: { category: true } }, verification: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(calls);
}
