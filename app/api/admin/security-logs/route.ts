import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Math.min(200, Math.max(1, Number(new URL(request.url).searchParams.get("limit") || 100)));
  const logs = await prisma.securityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit
  });

  return NextResponse.json({ logs });
}
