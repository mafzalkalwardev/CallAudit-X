import Link from "next/link";
import { BarChart3, CheckCircle2, Gauge, PhoneCall, TrendingDown } from "lucide-react";
import { ChartCard, CategoryPie, TimeLine } from "@/components/Charts";
import { Badge, LinkButton, PageHeader, StatCard } from "@/components/ui";
import { customerAnalytics } from "@/lib/analytics";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const data = session
    ? await customerAnalytics(session.id)
    : {
        totalCalls: 1284,
        analyzedCalls: 1196,
        averageAgentScore: 88,
        positiveCount: 742,
        negativeCount: 96,
        mostCommonCategory: "Sales Lead",
        categoryDistribution: [
          { name: "Sales Lead", value: 42, color: "#22D3EE" },
          { name: "Support", value: 26, color: "#2563EB" },
          { name: "Complaint", value: 12, color: "#FB7185" },
          { name: "Product Inquiry", value: 20, color: "#7C3AED" }
        ],
        callsOverTime: [
          { date: "Mon", calls: 18 },
          { date: "Tue", calls: 26 },
          { date: "Wed", calls: 21 },
          { date: "Thu", calls: 34 },
          { date: "Fri", calls: 29 }
        ],
        recentCalls: [
          { id: "demo-1", title: "Enterprise pricing inquiry", report: { category: { name: "Sales Lead" } }, verification: { status: "correct" } },
          { id: "demo-2", title: "Support escalation follow-up", report: { category: { name: "Customer Support" } }, verification: { status: "pending" } },
          { id: "demo-3", title: "Billing complaint review", report: { category: { name: "Complaint" } }, verification: { status: "incorrect" } }
        ]
      };
  return (
    <>
      <PageHeader title="Customer Dashboard" subtitle="Operational view of call volume, AI quality, sentiment, and customer verification performance." action={<LinkButton href="/dashboard/upload">Upload calls</LinkButton>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total calls" value={data.totalCalls} icon={PhoneCall} detail={`${data.analyzedCalls} analyzed`} trend="+12.4% vs last period" />
        <StatCard title="Average AI score" value={`${data.averageAgentScore}%`} icon={Gauge} detail="Agent performance" trend="+3.1 score lift" />
        <StatCard title="Positive sentiment" value={data.positiveCount} icon={CheckCircle2} detail={`${data.negativeCount} negative`} />
        <StatCard title="Top category" value={data.mostCommonCategory} icon={TrendingDown} detail="Most frequent AI classification" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Category distribution" subtitle="Share of analyzed calls by AI category"><CategoryPie data={data.categoryDistribution} /></ChartCard>
        <ChartCard title="Calls uploaded over time" subtitle="Daily ingestion trend from database records"><TimeLine data={data.callsOverTime} /></ChartCard>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-950/35">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-sky-300" /><h2 className="font-semibold text-slate-100">Recent calls</h2></div>
          <Link href="/dashboard/calls" className="text-sm font-medium text-sky-200 hover:text-sky-100">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.025] text-left text-xs uppercase tracking-[0.14em] text-slate-500"><tr><th className="p-4">Call</th><th className="p-4">Category</th><th className="p-4">Verification</th><th className="p-4 text-right">Action</th></tr></thead>
            <tbody>{data.recentCalls.map((call: any) => <tr key={call.id} className="border-t border-white/5 transition hover:bg-white/[0.035]"><td className="p-4 font-medium text-slate-200">{call.title}</td><td className="p-4 text-slate-400">{call.report?.category?.name || "Pending"}</td><td className="p-4"><Badge tone={call.verification?.status === "correct" ? "success" : call.verification?.status === "incorrect" ? "danger" : "warn"}>{call.verification?.status || "pending"}</Badge></td><td className="p-4 text-right"><Link className="font-medium text-sky-200 hover:text-sky-100" href={String(call.id).startsWith("demo") ? "/dashboard/calls" : `/dashboard/calls/${call.id}`}>Review</Link></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
