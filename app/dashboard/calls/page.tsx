import Link from "next/link";
import { Search, X } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CallsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession();
  const allCalls = session
    ? await prisma.call.findMany({
        where: { userId: session.id, report: { category: { name: searchParams.category || undefined }, sentiment: searchParams.sentiment as any || undefined } },
        include: { report: { include: { category: true } }, verification: true },
        orderBy: { createdAt: "desc" }
      })
    : [
        { id: "demo-1", title: "Enterprise pricing inquiry", agentName: "Maya Chen", campaignName: "Growth", createdAt: new Date(), report: { category: { name: "Sales Lead" }, sentiment: "Positive", agentScore: 92 }, verification: { status: "correct" } },
        { id: "demo-2", title: "Support escalation follow-up", agentName: "Owen Ross", campaignName: "Retention", createdAt: new Date(), report: { category: { name: "Customer Support" }, sentiment: "Neutral", agentScore: 84 }, verification: { status: "pending" } },
        { id: "demo-3", title: "Billing complaint review", agentName: "Lina Patel", campaignName: "Support", createdAt: new Date(), report: { category: { name: "Complaint" }, sentiment: "Negative", agentScore: 68 }, verification: { status: "incorrect" } }
      ];
  const minScore = Number(searchParams.score || 0);
  const maxScore = Number(searchParams.maxScore || 0);
  const calls = allCalls.filter((call) => {
    if (searchParams.status && (call.verification?.status || "pending") !== searchParams.status) return false;
    if (searchParams.date && call.createdAt.toISOString().slice(0, 10) !== searchParams.date) return false;
    if (minScore && (call.report?.agentScore || 0) < minScore) return false;
    if (maxScore && (call.report?.agentScore || 0) > maxScore) return false;
    return true;
  });
  const categories = session ? await prisma.category.findMany({ orderBy: { name: "asc" } }) : [{ id: "sales", name: "Sales Lead" }, { id: "support", name: "Customer Support" }, { id: "complaint", name: "Complaint" }];
  return (
    <>
      <PageHeader title="Calls" subtitle="Filter, inspect, and verify every uploaded recording." />
      <form className="mb-4 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-2 xl:grid-cols-7">
        <select className="input" name="category" defaultValue={searchParams.category || ""}><option value="">All categories</option>{categories.map((c) => <option key={c.id}>{c.name}</option>)}</select>
        <select className="input" name="sentiment" defaultValue={searchParams.sentiment || ""}><option value="">All sentiment</option><option>Positive</option><option>Neutral</option><option>Negative</option></select>
        <input className="input" name="score" placeholder="Score min" defaultValue={searchParams.score || ""} />
        <input className="input" name="maxScore" placeholder="Score max" defaultValue={searchParams.maxScore || ""} />
        <input className="input" name="date" type="date" defaultValue={searchParams.date || ""} />
        <select className="input" name="status" defaultValue={searchParams.status || ""}><option value="">All statuses</option><option value="pending">Pending</option><option value="correct">Verified correct</option><option value="incorrect">Corrected</option></select>
        <div className="flex gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2 font-medium text-slate-950"><Search className="h-4 w-4" />Apply</button>
          <Link href="/dashboard/calls" className="inline-flex items-center justify-center rounded-md border border-white/10 px-3 hover:bg-white/10" aria-label="Clear filters"><X className="h-4 w-4" /></Link>
        </div>
      </form>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/35">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm font-medium text-slate-200">{calls.length} calls</p>
          <p className="text-xs text-slate-500">Sorted by newest upload</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.025] text-left text-xs uppercase tracking-[0.14em] text-slate-500"><tr><th className="p-4">Call</th><th className="p-4">Category</th><th className="p-4">Sentiment</th><th className="p-4">Score</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4"></th></tr></thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-t border-white/5 transition hover:bg-white/[0.035]">
                <td className="p-4 font-medium text-slate-200">{call.title}<p className="mt-1 text-xs font-normal text-slate-500">{call.agentName || "Unknown agent"} - {call.campaignName || "No campaign"}</p></td>
                <td className="p-4 text-slate-400">{call.report?.category.name || "Analyzing"}</td>
                <td className="p-4 text-slate-400">{call.report?.sentiment || "-"}</td>
                <td className="p-4 text-slate-300">{call.report?.agentScore || "-"}</td>
                <td className="p-4 text-slate-400">{call.createdAt.toLocaleDateString()}</td>
                <td className="p-4"><Badge tone={call.verification?.status === "incorrect" ? "danger" : call.verification?.status === "correct" ? "success" : "warn"}>{call.verification?.status || "pending"}</Badge></td>
                <td className="pr-4 text-right"><Link className="text-cyan-200" href={String(call.id).startsWith("demo") ? "/dashboard" : `/dashboard/calls/${call.id}`}>Details</Link></td>
              </tr>
            ))}
            {!calls.length ? <tr><td colSpan={7} className="p-10 text-center text-slate-400">No calls match these filters.</td></tr> : null}
          </tbody>
        </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-slate-500">
          <span>Page 1 of 1</span>
          <div className="flex gap-2"><button className="rounded-md border border-white/10 px-3 py-1.5 opacity-50">Previous</button><button className="rounded-md border border-white/10 px-3 py-1.5 opacity-50">Next</button></div>
        </div>
      </div>
    </>
  );
}
