import { Activity, BadgeDollarSign, Bot, CheckCircle2, PhoneCall, RefreshCcw, Users } from "lucide-react";
import { CategoryBar, ChartCard, SentimentPie, TimeLine } from "@/components/Charts";
import { Card, PageHeader, StatCard } from "@/components/ui";
import { adminAnalytics } from "@/lib/analytics";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let data: any = {
    totalCustomers: 0,
    totalCalls: 0,
    processingCalls: 0,
    aiAccuracy: 0,
    correctedReviews: 0,
    revenue: 0,
    categoryDistribution: [],
    sentimentDistribution: [],
    verificationDistribution: [],
    callsOverTime: []
  };

  try {
    data = await adminAnalytics();
  } catch {
    // DB not available
  }

  const aiMode = process.env.OPENAI_API_KEY ? "Real AI" : "Fallback Mock";

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide customers, calls, AI processing, corrections, and billing." />
      
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Customers" value={data.totalCustomers} icon={Users} />
        <StatCard title="Uploaded calls" value={data.totalCalls} icon={PhoneCall} />
        <StatCard title="Processing" value={data.processingCalls} icon={Activity} />
        <StatCard title="AI accuracy" value={`${data.aiAccuracy}%`} icon={Bot} />
        <StatCard title="Corrections" value={data.correctedReviews} icon={RefreshCcw} />
        <StatCard title="Revenue" value={currency(data.revenue)} icon={BadgeDollarSign} detail="Paid transactions" />
      </div>

      <Card className="mt-6 border-[#2563EB]/20 bg-[#EFF6FF]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#2563EB]" />
            <h2 className="font-bold text-[#0F172A]">SaaS Platform Status</h2>
          </div>
          <span className="rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
            AI mode: {aiMode}
          </span>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Most used categories">
          <CategoryBar data={data.categoryDistribution} />
        </ChartCard>
        <ChartCard title="Sentiment distribution">
          <SentimentPie data={data.sentimentDistribution} />
        </ChartCard>
        <ChartCard title="Verification outcomes">
          <SentimentPie data={data.verificationDistribution} />
        </ChartCard>
        <ChartCard title="Calls over time">
          <TimeLine data={data.callsOverTime} />
        </ChartCard>
      </div>
    </>
  );
}
