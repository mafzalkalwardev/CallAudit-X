import { Role } from "@prisma/client";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    redirect("/login");
  }

  const user = await getCurrentUser();
  if (!user || user.role !== Role.ADMIN) {
    redirect("/login");
  }

  return <AppShell user={user} admin>{children}</AppShell>;
}
