import { Role } from "@prisma/client";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser, getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const user = await getCurrentUser();
  const shellUser = user || {
    name: "Demo Admin",
    email: "admin@callauditx.com",
    role: Role.ADMIN,
    plan: { name: "Business" }
  };
  return <AppShell user={shellUser} admin>{children}</AppShell>;
}
