import Link from "next/link";
import { Users, CreditCard, BarChart3 } from "lucide-react";
import { PageHeader, Card, Badge, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let users: any[] = [];
  let totalCustomers = 0;
  let activeSubscriptions = 0;
  let totalPayments = 0;

  try {
    users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { plan: true, calls: { select: { id: true } }, payments: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    activeSubscriptions = await prisma.user.count({ where: { subscriptionStatus: "active" } });
    totalPayments = await prisma.payment.count();
  } catch {
    // DB not available — show empty state
  }

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage customer accounts, subscriptions, and call usage across your platform."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} />
        <StatCard title="Active Subscriptions" value={activeSubscriptions} icon={CreditCard} />
        <StatCard title="Payments Processed" value={totalPayments} icon={BarChart3} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB]">
              <tr className="text-xs uppercase tracking-wider text-[#64748B]">
                <th className="px-5 py-4 text-left">Customer</th>
                <th className="px-5 py-4 text-left">Plan</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Calls</th>
                <th className="px-5 py-4 text-left">Payments</th>
                <th className="px-5 py-4 text-left">Joined</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#0F172A]">{user.name}</p>
                    <p className="text-xs text-[#94A3B8]">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    {user.plan ? <Badge tone="info">{user.plan.name}</Badge> : <span className="text-xs text-[#94A3B8]">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={user.subscriptionStatus === "active" ? "success" : "warn"}>{user.subscriptionStatus}</Badge>
                  </td>
                  <td className="px-5 py-4 font-bold text-[#2563EB]">{user.calls.length}</td>
                  <td className="px-5 py-4 font-bold text-[#2563EB]">{user.payments.length}</td>
                  <td className="px-5 py-4 text-xs text-[#94A3B8]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/customers/${user.id}`} className="text-[#2563EB] hover:text-[#1D4ED8] transition text-sm font-semibold">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-[#D8E1EE] mb-3" />
              <p className="font-semibold text-[#64748B]">No customers yet</p>
              <p className="mt-1 text-sm text-[#94A3B8]">Customers will appear here once they register.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
