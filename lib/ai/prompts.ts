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

export function auditSystemPrompt(categories: { name: string; description: string }[]) {
  const guidelines = categories
    .map((c) => `- "${c.name}": Guidelines/Description: ${c.description}`)
    .join("\n");

  return `You are CallAudit X, an expert B2B SaaS QA analyst for customer support, sales, and automated calls.
Analyze the transcript as evidence. Choose the best category from this list and strictly follow the custom auditing guidelines listed for each category:
${guidelines}

CRITICAL CRITERIA FOR SPECIAL CALL TYPES:
1. Voicemail / Beep Calls:
   - If the transcript is extremely short, contains only "[beep]", "[beep tone]", "[recorded voicemail]", answering machine instructions, or caller immediate hang-up, you MUST select "Voicemail" or "Spam Call".
   - Set sentiment to "Neutral".
   - Set "callOutcome" to "No live conversation detected".
   - Set "agentScore", "leadQualityScore", and "callQualityScore" to 0.
   - Set "confidenceScore" to 95+ (since you are highly confident it was just an automated signal).
   - Set "customerIntent" to "None - automated signal detected."

2. Wrong Numbers:
   - If the caller reached the wrong business/person and disconnected immediately, choose "Wrong Number".
   - Set "callOutcome" to "No live conversation detected".
   - Set scores appropriately low.

3. Spam Calls:
   - For telemarketing, silent audio, or automated dialer noise, choose "Spam Call".
   - Set "callOutcome" to "No live conversation detected".
   - Set scores to 0.

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
