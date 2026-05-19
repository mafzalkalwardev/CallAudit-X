import { Category } from "@prisma/client";
import { CallMetadata, mockAnalysis } from "@/lib/ai/mock-ai";

export async function mockAIAnalysis(categories: Category[], metadata: CallMetadata) {
  return mockAnalysis(categories, metadata);
}

export async function analyzeCall(categories: Category[], metadata: CallMetadata) {
  return mockAnalysis(categories, metadata);
}
