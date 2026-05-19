import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";
import { verificationSchema } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  const contentType = request.headers.get("content-type") || "";
  const raw = contentType.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());
  const input = verificationSchema.parse(raw);
  const userId = session?.id || demoUser!.id;
  const call = await prisma.call.findFirst({ where: { id: params.id, userId } });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (input.status === "incorrect" && !input.correctedCategoryId) return NextResponse.json({ error: "Correct category is required" }, { status: 400 });
  const verification = await prisma.reviewVerification.upsert({
    where: { callId: call.id },
    create: { callId: call.id, userId, status: input.status, correctedCategoryId: input.correctedCategoryId, feedback: input.feedback },
    update: { status: input.status, correctedCategoryId: input.correctedCategoryId || null, feedback: input.feedback || null }
  });
  return NextResponse.json({ ok: true, verification });
}
