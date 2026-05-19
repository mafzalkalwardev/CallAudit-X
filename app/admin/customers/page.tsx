import { AdminCustomersManager } from "@/components/AdminCustomersManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [users, plans] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        planId: true,
        subscriptionStatus: true,
        createdAt: true,
        updatedAt: true,
        plan: true,
        _count: { select: { calls: true, payments: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.plan.findMany({ orderBy: { price: "asc" } })
  ]);

  return <AdminCustomersManager initialUsers={users} plans={plans} />;
}
