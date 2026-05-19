import Link from "next/link";
import { Phone } from "lucide-react";
import { PageHeader, Card, Badge, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCallsPage() {
  let calls: any[] = [];
  let totalCalls = 0;
  let analyzedCalls = 0;
  let pendingCalls = 0;

  try {
    calls = await prisma.call.findMany({
      include: { user: true, report: { include: { category: true } }, verification: true },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    totalCalls = await prisma.call.count();
    analyzedCalls = await prisma.call.count({ where: { status: { in: ["analyzed", "completed"] } } });
    pendingCalls = await prisma.call.count({ where: { verification: { status: "pending" } } });
  } catch {
    // DB not available — show empty state
  }

  return (
    <>
      <PageHeader
        title="All Calls"
        subtitle="Monitor and review calls across all customers. Track processing status, AI accuracy, and verification outcomes."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Calls" value={totalCalls} icon={Phone} />
        <StatCard title="Analyzed" value={analyzedCalls} icon={Phone} />
        <StatCard title="Pending Review" value={pendingCalls} icon={Phone} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB]">
              <tr className="text-xs uppercase tracking-wider text-[#64748B]">
                <th className="px-5 py-4 text-left">Call</th>
                <th className="px-5 py-4 text-left">Customer</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Sentiment</th>
                <th className="px-5 py-4 text-left">Score</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {calls.map((call) => (
                <tr key={call.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#0F172A]">{call.title}</p>
                    <p className="text-xs text-[#94A3B8]">{call.fileName}</p>
                  </td>
                  <td className="px-5 py-4 text-[#64748B]">{call.user.email}</td>
                  <td className="px-5 py-4">
                    {call.report ? <Badge tone="info">{call.report.category.name}</Badge> : <span className="text-[#94A3B8]">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    {call.report ? (
                      <Badge tone={call.report.sentiment === "Positive" ? "success" : call.report.sentiment === "Negative" ? "danger" : "warn"}>
                        {call.report.sentiment}
                      </Badge>
                    ) : <span className="text-[#94A3B8]">—</span>}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#2563EB]">{call.report?.agentScore ?? "—"}</td>
                  <td className="px-5 py-4">
                    <Badge tone={call.status === "failed" ? "danger" : call.status === "analyzed" ? "success" : call.status === "uploaded" ? "warn" : "default"}>
                      {call.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/calls/${call.id}`} className="text-[#2563EB] hover:text-[#1D4ED8] transition text-sm font-semibold">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {calls.length === 0 && (
            <div className="p-12 text-center">
              <Phone className="mx-auto h-10 w-10 text-[#D8E1EE] mb-3" />
              <p className="font-semibold text-[#64748B]">No calls yet</p>
              <p className="mt-1 text-sm text-[#94A3B8]">Calls will appear here once customers upload recordings.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
