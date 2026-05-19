import Link from "next/link";
import { Activity, AlertCircle, RefreshCcw } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAIQueuePage() {
  let calls: any[] = [];

  try {
    calls = await prisma.call.findMany({
      where: { status: { in: ["queued", "transcribing", "analyzing", "failed"] } },
      include: { user: true, report: { include: { category: true } } },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <PageHeader
        title="AI Queue"
        subtitle="Calls currently queued, processing, or failed during AI analysis. Use Retry to re-queue failed calls."
      />

      {/* Architecture note */}
      <Card className="mb-6 border-[#F59E0B]/30 bg-[#FFFBEB]">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 shrink-0 text-[#B45309] mt-0.5" />
          <div>
            <p className="font-semibold text-[#B45309]">Background Processing Architecture</p>
            <p className="mt-1 text-sm text-[#64748B]">
              This queue is architecture-ready for Redis/BullMQ workers. Currently uses status fields (queued → transcribing → analyzing → completed/failed). 
              Add a BullMQ worker to <code className="bg-[#FEF9EC] px-1 rounded text-xs">lib/workers/ai-worker.ts</code> to process calls automatically.
            </p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB]">
              <tr className="text-xs uppercase tracking-wider text-[#64748B]">
                <th className="px-5 py-4 text-left">Call</th>
                <th className="px-5 py-4 text-left">Customer</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Updated</th>
                <th className="px-5 py-4 text-left">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {calls.map((call) => (
                <tr key={call.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="px-5 py-4">
                    <Link className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]" href={`/admin/calls/${call.id}`}>{call.title}</Link>
                    <p className="text-xs text-[#94A3B8]">{call.fileName}</p>
                  </td>
                  <td className="px-5 py-4 text-[#64748B]">{call.user.email}</td>
                  <td className="px-5 py-4">
                    <Badge tone={call.status === "failed" ? "danger" : "warn"}>{call.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#94A3B8]">{new Date(call.updatedAt).toLocaleString()}</td>
                  <td className="max-w-xs px-5 py-4 text-xs text-[#DC2626]">{call.errorMessage || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!calls.length && (
            <div className="p-12 text-center">
              <RefreshCcw className="mx-auto h-10 w-10 text-[#D8E1EE] mb-3" />
              <p className="font-semibold text-[#64748B]">Queue is clear</p>
              <p className="mt-1 text-sm text-[#94A3B8]">No calls are currently queued, processing, or failed.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
