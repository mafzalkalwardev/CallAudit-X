import { Category, Sentiment } from "@prisma/client";

export type TranscriptSegment = {
  timestamp: string;
  speaker: "Agent" | "Customer";
  text: string;
};

export type CallMetadata = {
  title: string;
  fileName?: string | null;
  agentName?: string | null;
  campaignName?: string | null;
  callType?: string | null;
  notes?: string | null;
};

export type AuditDraft = {
  transcript: string;
  transcriptSegments: TranscriptSegment[];
  summary: string;
  categoryId: string;
  categoryReason: string;
  sentiment: Sentiment;
  customerIntent: string;
  agentScore: number;
  leadQualityScore: number;
  callQualityScore: number;
  confidenceScore: number;
  keywords: string[];
  mistakes: string[];
  recommendedAction: string;
  customerMood: string;
  callOutcome: string;
};

const scenarios: Record<string, { segments: TranscriptSegment[]; outcome: string; reason: string }> = {
  "Sales Lead": {
    reason: "The caller asks about pricing, fit, and next steps for evaluating the platform.",
    outcome: "Qualified lead ready for sales follow-up",
    segments: [
      { timestamp: "00:00:04", speaker: "Agent", text: "Thanks for calling. What are you hoping to improve in your call review process?" },
      { timestamp: "00:00:18", speaker: "Customer", text: "We handle hundreds of calls and need faster transcripts, scoring, and manager review." },
      { timestamp: "00:00:43", speaker: "Agent", text: "That sounds like a good fit for an AI audit workflow with verification built in." },
      { timestamp: "00:01:09", speaker: "Customer", text: "Please send pricing and book a demo with our operations lead." }
    ]
  },
  "Customer Support": {
    reason: "The customer needs help resolving an existing product or account issue.",
    outcome: "Support issue documented with follow-up",
    segments: [
      { timestamp: "00:00:05", speaker: "Customer", text: "I uploaded a recording but cannot find the report in the dashboard." },
      { timestamp: "00:00:21", speaker: "Agent", text: "I can check the processing status and confirm the file type for you." },
      { timestamp: "00:00:49", speaker: "Customer", text: "It was a webm file from yesterday afternoon." },
      { timestamp: "00:01:15", speaker: "Agent", text: "The report is available now. I will send the review link and add a note to your case." }
    ]
  },
  Complaint: {
    reason: "The caller expresses frustration and asks for urgent resolution.",
    outcome: "Escalation required",
    segments: [
      { timestamp: "00:00:03", speaker: "Customer", text: "This is the third time I have called about the billing mistake." },
      { timestamp: "00:00:19", speaker: "Agent", text: "I understand why that is frustrating. I am reviewing the account history now." },
      { timestamp: "00:00:46", speaker: "Customer", text: "I need this fixed today and I need a clear answer." },
      { timestamp: "00:01:13", speaker: "Agent", text: "I will escalate it to billing and confirm the resolution timeline by email." }
    ]
  },
  "Appointment Booking": {
    reason: "The conversation centers on scheduling a consultation.",
    outcome: "Appointment booked",
    segments: [
      { timestamp: "00:00:06", speaker: "Customer", text: "I would like to book a consultation for next week." },
      { timestamp: "00:00:20", speaker: "Agent", text: "We have Tuesday morning or Thursday afternoon available." },
      { timestamp: "00:00:38", speaker: "Customer", text: "Thursday afternoon works best." },
      { timestamp: "00:00:58", speaker: "Agent", text: "Perfect, I have scheduled the appointment and sent a confirmation." }
    ]
  },
  "Product Inquiry": {
    reason: "The caller asks product capability and feature questions.",
    outcome: "Product questions answered",
    segments: [
      { timestamp: "00:00:05", speaker: "Customer", text: "Does the platform show analytics by campaign and agent?" },
      { timestamp: "00:00:23", speaker: "Agent", text: "Yes, each upload can include agent, campaign, call type, and notes." },
      { timestamp: "00:00:50", speaker: "Customer", text: "Can reviewers correct the AI category when it is wrong?" },
      { timestamp: "00:01:12", speaker: "Agent", text: "They can mark the report correct or submit a corrected category with feedback." }
    ]
  },
  Voicemail: {
    reason: "No live human speech detected; only answering machine tones or short automated beep triggers recorded.",
    outcome: "No live conversation detected",
    segments: [
      { timestamp: "00:00:01", speaker: "Agent", text: "Please leave a message after the beep." },
      { timestamp: "00:00:08", speaker: "Customer", text: "[Beep tone / Voicemail recording]" }
    ]
  },
  "Spam Call": {
    reason: "Automated robocall tone or promotional telemarketing audio with no constructive customer intent.",
    outcome: "No live conversation detected",
    segments: [
      { timestamp: "00:00:02", speaker: "Customer", text: "[Automated dialer tone / Static / Short beep]" }
    ]
  },
  "Wrong Number": {
    reason: "The caller reached the wrong business or dialer error, resulting in immediate disconnect.",
    outcome: "No live conversation detected",
    segments: [
      { timestamp: "00:00:04", speaker: "Customer", text: "Hello, is this the pizza shop?" },
      { timestamp: "00:00:08", speaker: "Agent", text: "No, this is CallAudit X. You have dialled a wrong number." },
      { timestamp: "00:00:11", speaker: "Customer", text: "Oh, sorry. Wrong number. Bye." }
    ]
  },
  "Successful Conversion": {
    reason: "The prospect successfully completed a checkout flow or accepted direct pricing.",
    outcome: "Call resulted in a booking, sale, or qualified win.",
    segments: [
      { timestamp: "00:00:05", speaker: "Agent", text: "Great, let's complete your subscription setup now." },
      { timestamp: "00:00:19", speaker: "Customer", text: "Perfect, I will authorize the invoice right away." }
    ]
  }
};

const recommendations: Record<string, string> = {
  "Sales Lead": "Send a tailored demo recap and assign a sales owner within 24 hours.",
  "Customer Support": "Confirm the issue is resolved and add the pattern to the support knowledge base.",
  Complaint: "Escalate to a senior owner and provide the customer with a clear remediation timeline.",
  "Appointment Booking": "Send the calendar confirmation and a reminder before the appointment.",
  "Product Inquiry": "Send feature documentation and offer a guided walkthrough.",
  "Successful Conversion": "Start onboarding and notify customer success.",
  Voicemail: "No immediate action. Return the call if customer left callback details.",
  "Follow-Up Required": "Create a follow-up task with the promised date and context.",
  "Wrong Number": "No action required.",
  "Spam Call": "No follow-up required; black-list dialer if repeated."
};

function stableHash(value: string) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function transcriptFromSegments(segments: TranscriptSegment[]) {
  return segments.map((segment) => `${segment.timestamp} - ${segment.speaker}: ${segment.text}`).join("\n");
}

function pickCategory(categories: Category[], metadata: CallMetadata) {
  const text = `${metadata.title} ${metadata.fileName || ""} ${metadata.callType || ""} ${metadata.notes || ""}`.toLowerCase();
  
  if (text.includes("voicemail") || text.includes("beep") || text.includes("machine") || text.includes("ring")) {
    return categories.find((c) => c.name === "Voicemail") || categories.find((c) => c.name === "Spam Call") || categories[0];
  }
  if (text.includes("spam") || text.includes("automated") || text.includes("dialer") || text.includes("robot") || text.includes("telemarket")) {
    return categories.find((c) => c.name === "Spam Call") || categories[0];
  }
  if (text.includes("wrong") || text.includes("disconnect") || text.includes("hangup") || text.includes("wrong number")) {
    return categories.find((c) => c.name === "Wrong Number") || categories[0];
  }
  if (text.includes("complaint") || text.includes("billing") || text.includes("escalat")) {
    return categories.find((c) => c.name === "Complaint") || categories[0];
  }
  if (text.includes("book") || text.includes("appointment")) {
    return categories.find((c) => c.name === "Appointment Booking") || categories[0];
  }
  if (text.includes("product") || text.includes("feature")) {
    return categories.find((c) => c.name === "Product Inquiry") || categories[0];
  }
  if (text.includes("sales") || text.includes("lead") || text.includes("pricing")) {
    return categories.find((c) => c.name === "Sales Lead") || categories[0];
  }
  if (text.includes("convert") || text.includes("deal") || text.includes("won") || text.includes("checkout")) {
    return categories.find((c) => c.name === "Successful Conversion") || categories[0];
  }
  
  return categories.find((c) => c.name === "Customer Support") || categories[0];
}

export function mockTranscript(metadata: CallMetadata) {
  const text = `${metadata.title} ${metadata.fileName || ""} ${metadata.callType || ""} ${metadata.notes || ""}`.toLowerCase();
  
  let scenarioName = "Customer Support";
  if (text.includes("voicemail") || text.includes("beep") || text.includes("machine") || text.includes("ring")) {
    scenarioName = "Voicemail";
  } else if (text.includes("spam") || text.includes("automated") || text.includes("dialer") || text.includes("robot")) {
    scenarioName = "Spam Call";
  } else if (text.includes("wrong") || text.includes("wrong number")) {
    scenarioName = "Wrong Number";
  } else if (text.includes("complaint")) {
    scenarioName = "Complaint";
  } else if (text.includes("book")) {
    scenarioName = "Appointment Booking";
  } else if (text.includes("product") || text.includes("feature")) {
    scenarioName = "Product Inquiry";
  } else if (text.includes("sales") || text.includes("pricing")) {
    scenarioName = "Sales Lead";
  } else if (text.includes("convert") || text.includes("won")) {
    scenarioName = "Successful Conversion";
  }

  const scenario = scenarios[scenarioName] || scenarios["Customer Support"];
  return {
    text: transcriptFromSegments(scenario.segments),
    segments: scenario.segments
  };
}

export function mockAudit(categories: Category[], metadata: CallMetadata, transcriptText?: string, transcriptSegments?: TranscriptSegment[]) {
  const category = pickCategory(categories, metadata);
  const scenario = scenarios[category.name] || scenarios["Customer Support"];
  const hash = stableHash(`${metadata.title}${metadata.fileName}${metadata.agentName}${metadata.notes}`);
  
  const isAutomated = ["Voicemail", "Spam Call", "Wrong Number"].includes(category.name);
  
  const sentiment: Sentiment = 
    category.name === "Complaint" 
      ? Sentiment.Negative 
      : isAutomated 
        ? Sentiment.Neutral 
        : hash % 3 === 0 
          ? Sentiment.Neutral 
          : Sentiment.Positive;

  const agentScore = clampScore(
    isAutomated 
      ? 0 
      : category.name === "Complaint" 
        ? 62 + (hash % 15) 
        : 78 + (hash % 18)
  );

  const leadQualityScore = clampScore(
    isAutomated 
      ? 0 
      : ["Sales Lead", "Product Inquiry", "Successful Conversion"].includes(category.name) 
        ? 74 + (hash % 20) 
        : 35 + (hash % 28)
  );

  const callQualityScore = clampScore(isAutomated ? 0 : 70 + (hash % 23));
  const confidenceScore = clampScore(isAutomated ? 95 + (hash % 5) : 78 + (hash % 18));
  const segments = transcriptSegments?.length ? transcriptSegments : scenario.segments;

  let summaryText = "";
  if (isAutomated) {
    summaryText = `This call was automatically classified as an automated ${category.name.toLowerCase()} tone or voicemail beep. No constructive conversational speech or agent action detected.`;
  } else {
    summaryText = `${metadata.agentName || "The agent"} handled a ${category.name.toLowerCase()} interaction${metadata.campaignName ? ` for ${metadata.campaignName}` : ""}. The customer intent was identified and the next action is clear.`;
  }

  return {
    transcript: transcriptText || transcriptFromSegments(segments),
    transcriptSegments: segments,
    summary: summaryText,
    categoryId: category.id,
    categoryReason: scenario.reason,
    sentiment,
    customerIntent: isAutomated ? "None - automated signal detected." : category.name === "Complaint" ? "Resolve a frustrating account issue quickly." : `Progress a ${category.name.toLowerCase()} conversation with clear next steps.`,
    agentScore,
    leadQualityScore,
    callQualityScore,
    confidenceScore,
    keywords: Array.from(new Set([category.name.toLowerCase(), metadata.callType || "inbound", "automated-detection", "qa"])).slice(0, 5),
    mistakes: isAutomated ? ["None - call did not reach an agent."] : agentScore < 75 ? ["Agent should confirm the exact timeline before ending the call.", "Customer concern could have been restated more clearly."] : ["No critical mistakes found."],
    recommendedAction: recommendations[category.name] || "Review the call and add a manager note.",
    customerMood: isAutomated ? "Neutral" : sentiment === "Negative" ? "Frustrated" : sentiment === "Positive" ? "Engaged" : "Neutral",
    callOutcome: scenario.outcome
  } satisfies AuditDraft;
}

export function mockAnalysis(categories: Category[], metadata: CallMetadata) {
  const transcript = mockTranscript(metadata);
  return mockAudit(categories, metadata, transcript.text, transcript.segments);
}
