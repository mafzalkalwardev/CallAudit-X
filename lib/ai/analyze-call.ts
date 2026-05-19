import { Prisma } from "@prisma/client";
import { defaultCategories } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { publicAudioPath } from "@/lib/storage";
import { mockAnalysis, mockAudit, mockTranscript } from "@/lib/ai/mock-ai";
import { auditWithOpenAI, hasOpenAIKey, transcribeWithOpenAI } from "@/lib/ai/openai-ai";

async function ensureCategories() {
  const existing = await prisma.category.findMany({ orderBy: { name: "asc" } });
  if (existing.length) return existing;

  for (const category of defaultCategories) {
    await prisma.category.upsert({ where: { name: category.name }, update: category, create: category });
  }
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function analyzeCall(callId: string) {
  const call = await prisma.call.findUnique({ where: { id: callId } });
  if (!call) throw new Error("Call not found.");

  const categories = await ensureCategories();
  const metadata = {
    title: call.title,
    fileName: call.fileName,
    agentName: call.agentName,
    campaignName: call.campaignName,
    callType: call.callType,
    notes: call.notes
  };

  try {
    await prisma.call.update({ where: { id: call.id }, data: { status: "transcribing", errorMessage: null } });

    let transcript = mockTranscript(metadata);
    let usedRealTranscription = false;
    if (hasOpenAIKey()) {
      try {
        transcript = await transcribeWithOpenAI(publicAudioPath(call.audioUrl));
        usedRealTranscription = true;
      } catch (error) {
        console.warn(`OpenAI transcription failed for call ${call.id}; falling back to mock transcription.`, error);
      }
    }

    await prisma.call.update({ where: { id: call.id }, data: { status: "analyzing" } });

    let report = mockAnalysis(categories, metadata);
    if (hasOpenAIKey() && usedRealTranscription) {
      try {
        report = await auditWithOpenAI(categories, metadata, transcript.text, transcript.segments);
      } catch (error) {
        console.warn(`OpenAI audit failed for call ${call.id}; falling back to mock audit.`, error);
        report = mockAudit(categories, metadata, transcript.text, transcript.segments);
      }
    } else {
      report = mockAudit(categories, metadata, transcript.text, transcript.segments);
    }

    const savedReport = await prisma.aIReport.upsert({
      where: { callId: call.id },
      create: {
        callId: call.id,
        ...report,
        transcriptSegments: report.transcriptSegments as unknown as Prisma.InputJsonValue
      },
      update: {
        ...report,
        transcriptSegments: report.transcriptSegments as unknown as Prisma.InputJsonValue
      },
      include: { category: true }
    });

    await prisma.reviewVerification.upsert({
      where: { callId: call.id },
      create: { callId: call.id, userId: call.userId, status: "pending" },
      update: {}
    });

    await prisma.call.update({ where: { id: call.id }, data: { status: "completed", errorMessage: null } });
    return savedReport;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Call analysis failed.";
    await prisma.call.update({ where: { id: call.id }, data: { status: "failed", errorMessage: message } });
    throw error;
  }
}
