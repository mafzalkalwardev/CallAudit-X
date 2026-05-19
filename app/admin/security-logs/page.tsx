import { PageHeader, Card, Badge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldCheck, History, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SecurityLogsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const logs = await prisma.securityLog.findMany({
    orderBy: { createdAt: "desc" }
  });

  function getLogTone(type: string) {
    if (type.includes("FAILED") || type.includes("INVALID") || type.includes("EXPIRED")) return "danger";
    if (type.includes("SENT") || type.includes("COMPLETED")) return "success";
    return "default";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Security & System Logs"
        eyebrow="Platform Governance"
        subtitle="Review real-time authentication auditing logs, password recovery operations, and email triggers."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-2xl border border-[#D8E1EE] bg-white flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Total Logs Recorded</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{logs.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/15 flex items-center justify-center text-[#2563EB]">
            <History className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#D8E1EE] bg-white flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Security Status</p>
            <p className="mt-2 text-base font-bold text-[#16A34A] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Fully Guarded
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] border border-[#16A34A]/15 flex items-center justify-center text-[#16A34A]">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[#D8E1EE] bg-white flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Failed Attempts</p>
            <p className="mt-2 text-2xl font-bold text-[#DC2626]">
              {logs.filter(l => l.status === "failed").length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/15 flex items-center justify-center text-[#DC2626]">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <Card className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-sm text-[#64748B] py-8 text-center">No security logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F5F7FB] text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Target Email</th>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3F9] text-[#334155]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F5F7FB] transition">
                    <td className="p-3">
                      <Badge tone={getLogTone(log.type)}>
                        {log.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold text-[#0F172A]">{log.email}</td>
                    <td className="p-3 font-mono text-xs text-[#64748B]">{log.userId || "—"}</td>
                    <td className="p-3 text-xs leading-normal">{log.message}</td>
                    <td className="p-3">
                      <Badge tone={log.status === "success" ? "success" : log.status === "failed" ? "danger" : "info"}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-[#64748B] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
