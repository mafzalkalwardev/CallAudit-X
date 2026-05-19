import Link from "next/link";
import { Activity, BarChart3, CheckCircle2, Gauge, PhoneCall, TrendingDown, XCircle } from "lucide-react";
import { ChartCard, CategoryPie, TimeLine } from "@/components/Charts";
import { Badge, LinkButton, PageHeader, StatCard } from "@/components/ui";
import { customerAnalytics } from "@/lib/analytics";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  const data = await customerAnalytics(session?.id || demoUser!.id);

  return (
    <>
      <PageHeader
        title="Customer Dashboard"
        subtitle="Operational view of call volume, AI quality, sentiment, and customer verification performance."
        action={<LinkButton href="/dashboard/upload">Upload calls</LinkButton>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total calls" value={data.totalCalls} icon={PhoneCall} detail={`${data.completedCalls} completed`} />
        <StatCard title="Processing" value={data.processingCalls} icon={Activity} detail="Queued, transcribing, or analyzing" />
        <StatCard title="Failed calls" value={data.failedCalls} icon={XCircle} detail="Needs retry or review" />
        <StatCard title="Average AI score" value={`${data.averageAgentScore}%`} icon={Gauge} detail={`${data.averageConfidence}% avg confidence`} />
        <StatCard title="Positive sentiment" value={data.positiveCount} icon={CheckCircle2} detail={`${data.negativeCount} negative`} />
        <StatCard title="Top category" value={data.mostCommonCategory} icon={TrendingDown} detail="Most frequent AI classification" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Category distribution" subtitle="Share of analyzed calls by AI category">
          <CategoryPie data={data.categoryDistribution} />
        </ChartCard>
        <ChartCard title="Calls uploaded over time" subtitle="Daily ingestion trend from database records">
          <TimeLine data={data.callsOverTime} />
        </ChartCard>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EEF3F9] p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#2563EB]" />
            <h2 className="font-semibold text-[#0F172A]">Recent calls</h2>
          </div>
          <Link href="/dashboard/calls" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FB] text-left text-xs uppercase tracking-[0.14em] text-[#64748B]">
              <tr>
                <th className="p-4">Call</th>
                <th className="p-4">Category</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {data.recentCalls.map((call: any) => (
                <tr key={call.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="p-4 font-semibold text-[#0F172A]">{call.title || call.fileName}</td>
                  <td className="p-4 text-[#64748B]">{call.report?.category?.name || "Pending"}</td>
                  <td className="p-4">
                    <Badge tone={call.verification?.status === "correct" ? "success" : call.verification?.status === "incorrect" ? "danger" : "warn"}>
                      {call.verification?.status || "pending"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition" href={`/dashboard/calls/${call.id}`}>
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {!data.recentCalls.length && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#94A3B8]">
                    No recent calls found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
