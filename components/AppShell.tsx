import { Role } from "@prisma/client";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";

type ShellUser = {
  name: string;
  email: string;
  role: Role;
  plan?: { name: string } | null;
};

export function AppShell({ children, user, admin = false }: { children: React.ReactNode; user: ShellUser; admin?: boolean }) {
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="flex">
        <AppSidebar user={user} admin={admin} />
        <div className="min-w-0 flex-1">
          <Topbar user={user} admin={admin} />
          <main className="mx-auto max-w-[1540px] px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
