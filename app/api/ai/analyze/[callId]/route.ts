import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { analyzeCall } from "@/lib/ai.service";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { callId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const call = await prisma.call.findFirst({ where: { id: params.callId, ...(session.role === Role.ADMIN ? {} : { userId: session.id }) } });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const categories = await prisma.category.findMany();
  const report = await analyzeCall(categories, call);
  await prisma.aIReport.upsert({ where: { callId: call.id }, create: { callId: call.id, ...report }, update: report });
  await prisma.call.update({ where: { id: call.id }, data: { status: "analyzed" } });
  return NextResponse.json({ ok: true });
}
