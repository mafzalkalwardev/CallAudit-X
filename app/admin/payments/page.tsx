import { BadgeDollarSign, CreditCard, PieChart } from "lucide-react";
import { CategoryBar, ChartCard, TimeLine } from "@/components/Charts";
import { Badge, Card, PageHeader, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const [payments, users] = await Promise.all([
    prisma.payment.findMany({
      include: { user: { select: { name: true, email: true, plan: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.findMany({ select: { plan: true } })
  ]);

  const paid = payments.filter((payment) => payment.status === "paid" || payment.status === "succeeded");
  const revenue = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => payment.status === "pending").length;

  const statusDistribution = Object.entries(
    payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const planDistribution = Object.entries(
    users.reduce<Record<string, number>>((acc, user) => {
      const name = user.plan?.name || "No plan";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const revenueByDate = Object.entries(
    paid.reduce<Record<string, number>>((acc, payment) => {
      const date = payment.createdAt.toISOString().slice(0, 10);
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cents]) => ({ date, calls: Math.round(cents / 100) }));

  return (
    <>
      <PageHeader title="Payments" subtitle="Revenue, payment status, plan distribution, and customer invoice history." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Revenue" value={currency(revenue)} icon={BadgeDollarSign} detail="Paid transactions" />
        <StatCard title="Transactions" value={payments.length} icon={CreditCard} detail={`${pending} pending`} />
        <StatCard title="Plans tracked" value={planDistribution.length} icon={PieChart} detail="Across all users" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartCard title="Revenue over time" subtitle="Paid revenue by day in dollars">
          <TimeLine data={revenueByDate} />
        </ChartCard>
        <ChartCard title="Payment status" subtitle="Transaction counts by status">
          <CategoryBar data={statusDistribution} />
        </ChartCard>
        <ChartCard title="Plan distribution" subtitle="Users by current plan">
          <CategoryBar data={planDistribution} />
        </ChartCard>
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB] text-left text-xs uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#F5F7FB]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#0F172A]">{payment.user.name}</p>
                    <p className="text-xs text-[#64748B]">{payment.user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[#334155]">{payment.planName}</td>
                  <td className="px-5 py-4 font-bold text-[#0F172A]">{currency(payment.amount)}</td>
                  <td className="px-5 py-4">
                    <Badge tone={payment.status === "paid" || payment.status === "succeeded" ? "success" : payment.status === "pending" ? "warn" : "danger"}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-[#64748B]">{payment.stripeSessionId || payment.id}</td>
                  <td className="px-5 py-4 text-xs text-[#64748B]">{payment.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!payments.length ? <div className="p-12 text-center text-sm text-[#64748B]">No payments recorded yet.</div> : null}
        </div>
      </Card>
    </>
  );
}
