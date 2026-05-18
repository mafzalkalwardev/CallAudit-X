import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verificationSchema } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const input = verificationSchema.parse(Object.fromEntries(formData.entries()));
  const call = await prisma.call.findFirst({ where: { id: params.id, userId: session.id } });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (input.status === "incorrect" && !input.correctedCategoryId) return NextResponse.json({ error: "Correct category is required" }, { status: 400 });
  await prisma.reviewVerification.upsert({
    where: { callId: call.id },
    create: { callId: call.id, userId: session.id, status: input.status, correctedCategoryId: input.correctedCategoryId, feedback: input.feedback },
    update: { status: input.status, correctedCategoryId: input.correctedCategoryId || null, feedback: input.feedback || null }
  });
  return NextResponse.json({ ok: true });
}
