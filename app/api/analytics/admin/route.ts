import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { adminAnalytics } from "@/lib/analytics";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await adminAnalytics());
}
