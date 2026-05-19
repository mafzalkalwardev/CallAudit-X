export const AUDIT_JSON_SCHEMA_DESCRIPTION = `
Return strict JSON only. Do not wrap it in markdown.
Shape:
{
  "summary": "string",
  "category": "string",
  "categoryReason": "string",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "customerIntent": "string",
  "customerMood": "string",
  "callOutcome": "string",
  "agentScore": number,
  "leadQualityScore": number,
  "callQualityScore": number,
  "confidenceScore": number,
  "keywords": ["string"],
  "mistakes": ["string"],
  "recommendedAction": "string"
}
Scores must be integers from 0 to 100.
`;

export function auditSystemPrompt(categoryNames: string[]) {
  return `You are CallAudit X, an expert QA analyst for customer support and sales calls.
Analyze the transcript as evidence. Choose the best category from this list: ${categoryNames.join(", ")}.
Prefer accurate, useful QA language over generic summaries.
${AUDIT_JSON_SCHEMA_DESCRIPTION}`;
}

export function auditUserPrompt(input: {
  title: string;
  agentName?: string | null;
  campaignName?: string | null;
  callType?: string | null;
  notes?: string | null;
  transcript: string;
}) {
  return `Call metadata:
Title: ${input.title}
Agent: ${input.agentName || "Unknown"}
Campaign: ${input.campaignName || "None"}
Call type: ${input.callType || "Unspecified"}
Notes: ${input.notes || "None"}

Transcript:
${input.transcript}`;
}
