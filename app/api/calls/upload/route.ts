import { NextResponse } from "next/server";
import { analyzeCall } from "@/lib/ai.service";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveAudio } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    if (!(audio instanceof File)) return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    const saved = await saveAudio(audio);
    const title = String(formData.get("title") || saved.fileName);
    const metadata = {
      title,
      agentName: String(formData.get("agentName") || ""),
      campaignName: String(formData.get("campaignName") || ""),
      callType: String(formData.get("callType") || ""),
      notes: String(formData.get("notes") || "")
    };
    const call = await prisma.call.create({
      data: {
        userId: session.id,
        title,
        audioUrl: saved.url,
        fileName: saved.fileName,
        fileSize: saved.fileSize,
        agentName: metadata.agentName,
        campaignName: metadata.campaignName,
        callType: metadata.callType,
        notes: metadata.notes,
        status: "analyzing"
      }
    });
    const categories = await prisma.category.findMany();
    const report = await analyzeCall(categories, metadata);
    await prisma.aIReport.create({ data: { callId: call.id, ...report } });
    await prisma.reviewVerification.create({ data: { callId: call.id, userId: session.id, status: "pending" } });
    await prisma.call.update({ where: { id: call.id }, data: { status: "analyzed" } });
    return NextResponse.json({ ok: true, callId: call.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}
