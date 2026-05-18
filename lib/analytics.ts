import { AIReport, Call, Category, ReviewVerification, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { average } from "@/lib/utils";

export async function customerAnalytics(userId: string) {
  const calls = await prisma.call.findMany({
    where: { userId },
    include: { report: { include: { category: true } }, verification: true },
    orderBy: { createdAt: "desc" }
  });
  return buildAnalytics(calls);
}

export async function adminAnalytics() {
  const [calls, customers, payments] = await Promise.all([
    prisma.call.findMany({ include: { report: { include: { category: true } }, verification: true, user: true }, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.payment.findMany()
  ]);
  const analytics = buildAnalytics(calls);
  return {
    ...analytics,
    totalCustomers: customers,
    revenue: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    correctedReviews: calls.filter((c) => c.verification?.status === "incorrect").length
  };
}

type AnalyticsCall = Call & {
  report: (AIReport & { category: Category }) | null;
  verification: ReviewVerification | null;
};

function buildAnalytics(calls: AnalyticsCall[]) {
  const analyzed = calls.filter((c) => c.report);
  const reports = analyzed.map((c) => c.report!);
  const categoryMap = new Map<string, { name: string; color: string; count: number; scoreTotal: number }>();
  const sentimentMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();

  for (const call of calls) {
    const day = call.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    if (!call.report) continue;
    const category = call.report.category;
    const current = categoryMap.get(category.name) || { name: category.name, color: category.color, count: 0, scoreTotal: 0 };
    current.count += 1;
    current.scoreTotal += call.report.agentScore;
    categoryMap.set(category.name, current);
    sentimentMap.set(call.report.sentiment, (sentimentMap.get(call.report.sentiment) || 0) + 1);
  }

  const verified = calls.filter((c) => c.verification && c.verification.status !== "pending");
  const correct = verified.filter((c) => c.verification?.status === "correct");
  const categoryDistribution = [...categoryMap.values()].map((item) => ({
    name: item.name,
    value: item.count,
    color: item.color,
    percentage: analyzed.length ? Math.round((item.count / analyzed.length) * 100) : 0,
    averageScore: Math.round(item.scoreTotal / item.count)
  }));

  return {
    totalCalls: calls.length,
    analyzedCalls: analyzed.length,
    averageAgentScore: average(reports.map((r) => r.agentScore)),
    averageLeadQuality: average(reports.map((r) => r.leadQualityScore)),
    averageConfidence: average(reports.map((r) => r.confidenceScore)),
    aiAccuracy: verified.length ? Math.round((correct.length / verified.length) * 100) : 100,
    positiveCount: reports.filter((r) => r.sentiment === "Positive").length,
    negativeCount: reports.filter((r) => r.sentiment === "Negative").length,
    mostCommonCategory: categoryDistribution.sort((a, b) => b.value - a.value)[0]?.name || "No data",
    categoryDistribution,
    sentimentDistribution: [...sentimentMap.entries()].map(([name, value]) => ({ name, value })),
    callsOverTime: [...dailyMap.entries()].sort().map(([date, calls]) => ({ date, calls })),
    recentCalls: calls.slice(0, 6)
  };
}
