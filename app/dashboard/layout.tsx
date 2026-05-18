import { Role } from "@prisma/client";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser, getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user = await getCurrentUser();
  const shellUser = user || {
    name: "Demo Customer",
    email: "customer@callauditx.com",
    role: Role.CUSTOMER,
    plan: { name: "Pro" }
  };
  return <AppShell user={shellUser}>{children}</AppShell>;
}
