import Link from "next/link";
import { Badge, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAIQueuePage() {
  const calls = await prisma.call.findMany({
    where: { status: { in: ["queued", "transcribing", "analyzing", "failed"] } },
    include: { user: true, report: { include: { category: true } } },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <PageHeader title="AI Queue" subtitle="Calls currently queued, processing, or failed during AI analysis." />
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400"><tr><th className="p-4">Call</th><th>Customer</th><th>Status</th><th>Updated</th><th>Error</th></tr></thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-t border-white/5">
                <td className="p-4"><Link className="text-cyan-200" href={`/admin/calls/${call.id}`}>{call.title}</Link><p className="text-xs text-slate-500">{call.fileName}</p></td>
                <td>{call.user.email}</td>
                <td><Badge tone={call.status === "failed" ? "danger" : "warn"}>{call.status}</Badge></td>
                <td>{call.updatedAt.toLocaleString()}</td>
                <td className="max-w-md text-rose-200">{call.errorMessage || "-"}</td>
              </tr>
            ))}
            {!calls.length ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No calls are waiting in the AI queue.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
