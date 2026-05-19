import Link from "next/link";
import { Search, UploadCloud, X } from "lucide-react";
import { Badge, LinkButton, PageHeader } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isNoLiveConversation } from "@/lib/categories";

export const dynamic = "force-dynamic";

function statusTone(status?: string) {
  if (status === "completed" || status === "analyzed") return "success";
  if (status === "failed") return "danger";
  return "warn";
}

export default async function CallsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const allCalls = await prisma.call.findMany({
    where: {
      userId: session.id,
      report: {
        category: { name: searchParams.category || undefined },
        sentiment: (searchParams.sentiment as any) || undefined
      }
    },
    include: { report: { include: { category: true } }, verification: true },
    orderBy: { createdAt: "desc" }
  });

  const minScore = Number(searchParams.score || 0);
  const maxScore = Number(searchParams.maxScore || 0);
  const calls = allCalls.filter((call) => {
    if (searchParams.status && (call.verification?.status || "pending") !== searchParams.status) return false;
    if (searchParams.processingStatus && call.status !== searchParams.processingStatus) return false;
    if (searchParams.date && call.createdAt.toISOString().slice(0, 10) !== searchParams.date) return false;
    if (minScore && (call.report?.agentScore || 0) < minScore) return false;
    if (maxScore && (call.report?.agentScore || 0) > maxScore) return false;
    return true;
  });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <PageHeader
        title="Call Library"
        subtitle="Filter, inspect, and verify uploaded recordings from the database."
        action={<LinkButton href="/dashboard/upload">Upload calls</LinkButton>}
      />

      <form className="mb-6 grid gap-3 rounded-2xl border border-[#D8E1EE] bg-white p-4 md:grid-cols-2 lg:grid-cols-8">
        <select className="input" name="category" defaultValue={searchParams.category || ""}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id}>{category.name}</option>)}
        </select>
        <select className="input" name="sentiment" defaultValue={searchParams.sentiment || ""}>
          <option value="">All sentiment</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <select className="input" name="processingStatus" defaultValue={searchParams.processingStatus || ""}>
          <option value="">All processing</option>
          <option value="queued">Queued</option>
          <option value="transcribing">Transcribing</option>
          <option value="analyzing">Analyzing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <input className="input" name="score" placeholder="Score min" defaultValue={searchParams.score || ""} />
        <input className="input" name="maxScore" placeholder="Score max" defaultValue={searchParams.maxScore || ""} />
        <input className="input" name="date" type="date" defaultValue={searchParams.date || ""} />
        <select className="input" name="status" defaultValue={searchParams.status || ""}>
          <option value="">All verification</option>
          <option value="pending">Pending</option>
          <option value="correct">Verified correct</option>
          <option value="incorrect">Corrected</option>
        </select>
        <div className="flex gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
            <Search className="h-4 w-4" />Apply
          </button>
          <Link href="/dashboard/calls" className="inline-flex items-center justify-center rounded-xl border border-[#D8E1EE] px-3 hover:bg-[#F5F7FB] transition" aria-label="Clear filters">
            <X className="h-4 w-4 text-[#64748B]" />
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EEF3F9] px-4 py-3">
          <p className="text-sm font-semibold text-[#0F172A]">{calls.length} calls found</p>
          <p className="text-xs text-[#64748B]">Sorted by newest upload</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FB] text-left text-xs uppercase tracking-[0.14em] text-[#64748B]">
              <tr>
                <th className="p-4">Call</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sentiment</th>
                <th className="p-4">Score</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Processing</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {calls.map((call) => (
                <tr key={call.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="p-4">
                    <p className="font-semibold text-[#0F172A]">{call.title || call.fileName}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {call.fileName} | {call.agentName || "Unknown agent"} | {call.campaignName || "No campaign"}
                    </p>
                  </td>
                  <td className="p-4 text-[#64748B]">{call.report?.category.name || "Pending"}</td>
                  <td className="p-4">
                    {call.report ? (
                      <Badge tone={call.report.sentiment === "Positive" ? "success" : call.report.sentiment === "Negative" ? "danger" : "warn"}>
                        {call.report.sentiment}
                      </Badge>
                    ) : <span className="text-[#94A3B8]">—</span>}
                  </td>
                  <td className="p-4 font-bold text-[#2563EB]">
                    {call.report ? (isNoLiveConversation(call.report.category.name) ? "N/A" : call.report.agentScore) : "—"}
                  </td>
                  <td className="p-4 text-[#334155]">{call.report ? `${call.report.confidenceScore}%` : "—"}</td>
                  <td className="p-4">
                    <Badge tone={statusTone(call.status)}>{call.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge tone={call.verification?.status === "incorrect" ? "danger" : call.verification?.status === "correct" ? "success" : "warn"}>
                      {call.verification?.status || "pending"}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs text-[#64748B]">{new Date(call.createdAt).toLocaleDateString()}</td>
                  <td className="pr-4 text-right">
                    <Link className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]" href={`/dashboard/calls/${call.id}`}>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              {!calls.length ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="mx-auto max-w-md">
                      <UploadCloud className="mx-auto h-10 w-10 text-[#94A3B8] mb-3" />
                      <p className="font-semibold text-[#0F172A]">No calls found</p>
                      <p className="mt-1 text-sm text-[#64748B]">Upload audio recordings to start AI QA transcripts and scorecards.</p>
                      <LinkButton href="/dashboard/upload" className="mt-5">
                        Upload calls
                      </LinkButton>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
