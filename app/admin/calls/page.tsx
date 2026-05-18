import Link from "next/link";
import { Badge, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCallsPage() {
  const calls = await prisma.call.findMany({ include: { user: true, report: { include: { category: true } }, verification: true }, orderBy: { createdAt: "desc" } });
  return <><PageHeader title="All Calls" subtitle="Every customer upload, AI report, and correction status." /><div className="overflow-x-auto rounded-lg border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5 text-left text-slate-400"><tr><th className="p-4">Call</th><th>Customer</th><th>Category</th><th>Sentiment</th><th>Score</th><th>Verification</th></tr></thead><tbody>{calls.map((call) => <tr key={call.id} className="border-t border-white/5"><td className="p-4"><Link className="text-cyan-200" href={`/admin/calls/${call.id}`}>{call.title}</Link></td><td>{call.user.email}</td><td>{call.report?.category.name}</td><td>{call.report?.sentiment}</td><td>{call.report?.agentScore}</td><td><Badge>{call.verification?.status || "pending"}</Badge></td></tr>)}</tbody></table></div></>;
}
