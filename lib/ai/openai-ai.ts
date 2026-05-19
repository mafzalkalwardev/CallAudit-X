import { createReadStream } from "fs";
import OpenAI from "openai";
import { Category, Sentiment } from "@prisma/client";
import { auditSystemPrompt, auditUserPrompt } from "@/lib/ai/prompts";
import { AuditDraft, CallMetadata, mockAudit, TranscriptSegment } from "@/lib/ai/mock-ai";

let client: OpenAI | null = null;

function openaiClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  client ||= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

function asSentiment(value: unknown): Sentiment {
  return value === "Positive" || value === "Negative" || value === "Neutral" ? value : Sentiment.Neutral;
}

function score(value: unknown, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function stringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item)).filter(Boolean).slice(0, 8);
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI audit response was not valid JSON.");
    return JSON.parse(match[0]);
  }
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function transcribeWithOpenAI(audioPath: string) {
  const openai = openaiClient();
  if (!openai) throw new Error("OPENAI_API_KEY is not configured.");

  const model = process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-transcribe";
  const transcription = await openai.audio.transcriptions.create({
    file: createReadStream(audioPath) as any,
    model,
    response_format: "json"
  });

  const text = typeof transcription.text === "string" ? transcription.text : "";
  if (!text.trim()) throw new Error("OpenAI returned an empty transcription.");
  return {
    text,
    segments: [] as TranscriptSegment[]
  };
}

export async function auditWithOpenAI(categories: Category[], metadata: CallMetadata, transcriptText: string, transcriptSegments: TranscriptSegment[] = []) {
  const openai = openaiClient();
  if (!openai) throw new Error("OPENAI_API_KEY is not configured.");

  const fallback = mockAudit(categories, metadata, transcriptText, transcriptSegments);
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_AUDIT_MODEL || "gpt-4.1-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: auditSystemPrompt(categories) },
      { role: "user", content: auditUserPrompt({ ...metadata, transcript: transcriptText }) }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty audit response.");
  const parsed = safeJson(content) as Record<string, unknown>;
  const selectedCategoryName = String(parsed.category || fallback.categoryReason || "");
  const category =
    categories.find((item) => item.name.toLowerCase() === selectedCategoryName.toLowerCase()) ||
    categories.find((item) => item.name === "Customer Support") ||
    categories[0];

  return {
    ...fallback,
    summary: String(parsed.summary || fallback.summary),
    categoryId: category.id,
    categoryReason: String(parsed.categoryReason || fallback.categoryReason),
    sentiment: asSentiment(parsed.sentiment),
    customerIntent: String(parsed.customerIntent || fallback.customerIntent),
    customerMood: String(parsed.customerMood || fallback.customerMood),
    callOutcome: String(parsed.callOutcome || fallback.callOutcome),
    agentScore: score(parsed.agentScore, fallback.agentScore),
    leadQualityScore: score(parsed.leadQualityScore, fallback.leadQualityScore),
    callQualityScore: score(parsed.callQualityScore, fallback.callQualityScore),
    confidenceScore: score(parsed.confidenceScore, fallback.confidenceScore),
    keywords: stringArray(parsed.keywords, fallback.keywords),
    mistakes: stringArray(parsed.mistakes, fallback.mistakes),
    recommendedAction: String(parsed.recommendedAction || fallback.recommendedAction),
    transcript: transcriptText,
    transcriptSegments
  } satisfies AuditDraft;
}
