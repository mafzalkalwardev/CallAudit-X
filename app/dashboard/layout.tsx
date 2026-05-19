import { Role } from "@prisma/client";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role === Role.ADMIN) {
    redirect("/admin/dashboard");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
