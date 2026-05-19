import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveAudio } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = { id: session.id };
    const formData = await request.formData();
    const audioEntries = formData.getAll("audio").filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!audioEntries.length) {
      return NextResponse.json({ error: "At least one audio file is required." }, { status: 400 });
    }

    const uploaded = [];
    for (const audio of audioEntries) {
      const saved = await saveAudio(audio);
      const titleInput = String(formData.get("title") || "").trim();
      const title = audioEntries.length === 1 && titleInput ? titleInput : saved.fileName;

      const call = await prisma.call.create({
        data: {
          userId: user.id,
          title,
          audioUrl: saved.url,
          fileName: saved.fileName,
          fileSize: saved.fileSize,
          agentName: String(formData.get("agentName") || "").trim() || null,
          campaignName: String(formData.get("campaignName") || "").trim() || null,
          callType: String(formData.get("callType") || "").trim() || null,
          notes: String(formData.get("notes") || "").trim() || null,
          status: "queued"
        }
      });

      uploaded.push({ callId: call.id, id: call.id, fileName: call.fileName, audioUrl: call.audioUrl, status: call.status });
    }

    return NextResponse.json({ ok: true, callIds: uploaded.map((item) => item.callId), calls: uploaded });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
