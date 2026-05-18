import { PageHeader, Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { plan: true, calls: true, payments: true }, orderBy: { createdAt: "desc" } });
  return <><PageHeader title="Customers" subtitle="Plan, payment, and usage visibility." /><div className="overflow-x-auto rounded-lg border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5 text-left text-slate-400"><tr><th className="p-4">Customer</th><th>Plan</th><th>Status</th><th>Calls</th><th>Payments</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-white/5"><td className="p-4"><div className="font-medium">{user.name}</div><div className="text-slate-400">{user.email}</div></td><td>{user.plan?.name || "None"}</td><td><Badge>{user.subscriptionStatus}</Badge></td><td>{user.calls.length}</td><td>{user.payments.length}</td><td>{user.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table></div></>;
}
