import { BadgeDollarSign, Bot, PhoneCall, RefreshCcw, Users } from "lucide-react";
import { CategoryBar, ChartCard, SentimentPie } from "@/components/Charts";
import { PageHeader, StatCard } from "@/components/ui";
import { adminAnalytics } from "@/lib/analytics";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await adminAnalytics();
  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide customers, calls, revenue, and AI correction telemetry." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><StatCard title="Customers" value={data.totalCustomers} icon={Users} /><StatCard title="Uploaded calls" value={data.totalCalls} icon={PhoneCall} /><StatCard title="Revenue" value={currency(data.revenue)} icon={BadgeDollarSign} /><StatCard title="AI accuracy" value={`${data.aiAccuracy}%`} icon={Bot} /><StatCard title="Corrected reviews" value={data.correctedReviews} icon={RefreshCcw} /></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><ChartCard title="Most used categories"><CategoryBar data={data.categoryDistribution} /></ChartCard><ChartCard title="Sentiment distribution"><SentimentPie data={data.sentimentDistribution} /></ChartCard></div>
    </>
  );
}
