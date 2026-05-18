import { Category, Sentiment } from "@prisma/client";

type Metadata = {
  title: string;
  agentName?: string | null;
  campaignName?: string | null;
  callType?: string | null;
  notes?: string | null;
};

const transcriptBank: Record<string, string[]> = {
  "Sales Lead": [
    "Agent: Thanks for calling. What problem are you trying to solve today?\nCustomer: We are comparing vendors for call quality tracking and need something that can show agent scores.\nAgent: I can walk you through the Pro plan and send a follow-up with pricing.",
    "Agent: Are you looking for analytics or transcription first?\nCustomer: Both. We want managers to identify high-value leads and coach agents faster.\nAgent: Great, I will qualify the account and schedule a demo."
  ],
  "Customer Support": [
    "Customer: I uploaded a file but cannot see the report.\nAgent: I can check the processing status and confirm the supported file type.\nCustomer: It was an m4a file from yesterday.\nAgent: I see it is processed now and will resend the report link.",
  ],
  Complaint: [
    "Customer: This is the third time I have called about the billing issue.\nAgent: I understand the frustration and I am reviewing the account history now.\nCustomer: I need this fixed today.\nAgent: I will escalate it and confirm the resolution by email."
  ],
  "Appointment Booking": [
    "Customer: I would like to book a consultation for next week.\nAgent: We have Tuesday morning or Thursday afternoon available.\nCustomer: Thursday works.\nAgent: Perfect, I have scheduled the appointment and sent a confirmation."
  ],
  "Spam Call": ["Caller: Congratulations, your listing has been selected for a limited promotion.\nAgent: We are not interested.\nCaller: This offer expires today."],
  "Wrong Number": ["Caller: Is this Maple Dental?\nAgent: No, this is CallAudit X support.\nCaller: Sorry, wrong number.\nAgent: No problem, have a good day."],
  Voicemail: ["Voicemail: Hi, this is Dana. I am calling about the quote you sent. Please call me back tomorrow afternoon. Thank you."],
  "Follow-Up Required": ["Customer: I need to speak with my partner before choosing a plan.\nAgent: I can send a recap and follow up Friday.\nCustomer: Friday is good.\nAgent: I will set a reminder."],
  "Product Inquiry": ["Customer: Does the product support analytics by campaign?\nAgent: Yes, reports can be grouped by campaign, category, sentiment, and score.\nCustomer: Can it handle multiple agents?\nAgent: Agent metadata is supported on every upload."],
  "Successful Conversion": ["Agent: Would you like to start with the Pro plan today?\nCustomer: Yes, let's do it.\nAgent: Excellent. I will send the checkout link and onboarding notes now."]
};

const recommendations: Record<string, string> = {
  "Sales Lead": "Send tailored demo recap and assign sales owner within 24 hours.",
  "Customer Support": "Confirm resolution and add the issue to the support knowledge base.",
  Complaint: "Escalate to a senior agent and contact the customer with a clear remediation timeline.",
  "Appointment Booking": "Send confirmation and reminder before the appointment window.",
  "Spam Call": "No follow-up required; tag source if repeated.",
  "Wrong Number": "No action required.",
  Voicemail: "Return the call during the requested callback window.",
  "Follow-Up Required": "Create a follow-up task with the promised date and context.",
  "Product Inquiry": "Send product documentation and invite the caller to a guided walkthrough.",
  "Successful Conversion": "Start onboarding and notify customer success."
};

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function score(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function mockAIAnalysis(categories: Category[], metadata: Metadata) {
  const category = pick(categories);
  const categoryName = category.name;
  const sentiment: Sentiment = categoryName === "Complaint" ? Sentiment.Negative : categoryName === "Wrong Number" || categoryName === "Spam Call" ? Sentiment.Neutral : pick([Sentiment.Positive, Sentiment.Neutral]);
  const transcript = pick(transcriptBank[categoryName] || transcriptBank["Customer Support"]);
  const agentScore = categoryName === "Complaint" ? score(52, 78) : score(72, 96);
  const leadQualityScore = ["Sales Lead", "Product Inquiry", "Successful Conversion"].includes(categoryName) ? score(72, 98) : score(20, 70);
  const callQualityScore = score(66, 97);
  const confidenceScore = score(74, 96);
  return {
    transcript,
    summary: `${metadata.agentName || "The agent"} handled a ${categoryName.toLowerCase()} call${metadata.campaignName ? ` for ${metadata.campaignName}` : ""}. The caller intent was identified and the next action is clear.`,
    categoryId: category.id,
    sentiment,
    customerIntent: `Resolve or progress a ${categoryName.toLowerCase()} interaction.`,
    agentScore,
    leadQualityScore,
    callQualityScore,
    confidenceScore,
    keywords: [categoryName.toLowerCase(), metadata.callType || "inbound", "follow-up", "quality", "intent"].slice(0, score(3, 5)),
    mistakes: agentScore < 70 ? ["Agent did not confirm timeline clearly", "Missed opportunity to restate customer concern"] : ["No critical mistakes found"],
    recommendedAction: recommendations[categoryName] || "Review call and add a manager note.",
    customerMood: sentiment === "Negative" ? "Frustrated" : sentiment === "Positive" ? "Engaged" : "Neutral",
    callOutcome: categoryName === "Successful Conversion" ? "Converted" : categoryName === "Wrong Number" ? "Closed - wrong number" : "Follow-up tracked"
  };
}

export async function analyzeCall(categories: Category[], metadata: Metadata) {
  if (!process.env.OPENAI_API_KEY) return mockAIAnalysis(categories, metadata);
  try {
    // Future integration point: transcribe audio with OpenAI, then generate structured audit JSON.
    return await mockAIAnalysis(categories, metadata);
  } catch {
    return mockAIAnalysis(categories, metadata);
  }
}
