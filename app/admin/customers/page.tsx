import Link from "next/link";
import { Users, CreditCard, BarChart3 } from "lucide-react";
import { PageHeader, Button, Card, Badge, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { plan: true, calls: true, payments: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const activeSubscriptions = await prisma.user.count({ where: { subscriptionStatus: "active" } });
  const totalPayments = await prisma.payment.count();

  const stats = [
    { title: "Total Customers", value: totalCustomers, icon: Users },
    { title: "Active Subscriptions", value: activeSubscriptions, icon: CreditCard },
    { title: "Payments Processed", value: totalPayments, icon: BarChart3 }
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage customer accounts, subscriptions, and usage across your platform."
        action={<Button variant="outline">Export List</Button>}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Customers table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800/30 bg-slate-900/50">
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Plan</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Calls</th>
                <th className="px-6 py-4 text-left">Payments</th>
                <th className="px-6 py-4 text-left">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-100">{user.name}</p>
                    <p className="text-xs text-soft">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">{user.plan ? <Badge tone="info">{user.plan.name}</Badge> : <span className="text-soft text-xs">-</span>}</td>
                  <td className="px-6 py-4">
                    <Badge tone={user.subscriptionStatus === "active" ? "success" : "warn"}>{user.subscriptionStatus}</Badge>
                  </td>
                  <td className="px-6 py-4 text-primary font-semibold">{user.calls.length}</td>
                  <td className="px-6 py-4 text-primary font-semibold">{user.payments.length}</td>
                  <td className="px-6 py-4 text-soft text-xs">{user.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${user.id}`} className="text-primary hover:text-blue-400 transition text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-soft">No customers yet.</div>
          )}
        </div>
      </Card>
    </>
  );
}
