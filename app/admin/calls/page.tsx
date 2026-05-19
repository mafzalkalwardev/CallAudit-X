import Link from "next/link";
import { Search, Filter, Phone } from "lucide-react";
import { PageHeader, Button, Card, Badge, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCallsPage() {
  const calls = await prisma.call.findMany({
    include: { user: true, report: { include: { category: true } }, verification: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  const totalCalls = await prisma.call.count();
  const analyzedCalls = await prisma.call.count({ where: { status: { in: ["analyzed", "completed"] } } });
  const pendingCalls = await prisma.call.count({ where: { verification: { status: "pending" } } });

  const stats = [
    { title: "Total Calls", value: totalCalls, icon: Phone },
    { title: "Analyzed", value: analyzedCalls, icon: Phone },
    { title: "Pending Review", value: pendingCalls, icon: Phone }
  ];

  return (
    <>
      <PageHeader
        title="All Calls"
        subtitle="Monitor and review calls across all customers. Track processing status, AI accuracy, and verification outcomes."
        action={<Button variant="outline">Export Report</Button>}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800/30 bg-slate-900/50">
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 text-left">Call</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Sentiment</th>
                <th className="px-6 py-4 text-left">Score</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-100">{call.title}</p>
                    <p className="text-xs text-soft">{call.fileName}</p>
                  </td>
                  <td className="px-6 py-4 text-soft">{call.user.email}</td>
                  <td className="px-6 py-4">
                    {call.report ? <Badge tone="info">{call.report.category.name}</Badge> : <span className="text-soft">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    {call.report ? (
                      <Badge tone={call.report.sentiment === "Positive" ? "success" : call.report.sentiment === "Negative" ? "danger" : "warn"}>
                        {call.report.sentiment}
                      </Badge>
                    ) : (
                      <span className="text-soft">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">{call.report?.agentScore ?? "-"}</td>
                  <td className="px-6 py-4">
                    <Badge
                      tone={
                        call.status === "failed"
                          ? "danger"
                          : call.status === "analyzed"
                            ? "success"
                            : call.status === "uploaded"
                              ? "warn"
                              : "default"
                      }
                    >
                      {call.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/calls/${call.id}`} className="text-primary hover:text-blue-400 transition text-sm font-medium">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {calls.length === 0 && (
            <div className="p-8 text-center text-soft">No calls found.</div>
          )}
        </div>
      </Card>
    </>
  );
}
