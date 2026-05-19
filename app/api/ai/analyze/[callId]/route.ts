import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { analyzeCall } from "@/lib/ai/analyze-call";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { callId: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const where = {
      id: params.callId,
      ...(session.role === Role.ADMIN ? {} : { userId: session.id })
    };
    const call = await prisma.call.findFirst({ where });
    if (!call) return NextResponse.json({ error: "Call not found." }, { status: 404 });

    const report = await analyzeCall(call.id);
    const updatedCall = await prisma.call.findUnique({
      where: { id: call.id },
      include: { report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
    });
    return NextResponse.json({ ok: true, report, call: updatedCall });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed." }, { status: 500 });
  }
}
