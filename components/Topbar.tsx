import Link from "next/link";
import { Bell, ChevronDown, Search, Sparkles } from "lucide-react";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui";

type ShellUser = {
  name: string;
  email: string;
  role: Role;
  plan?: { name: string } | null;
};

export function Topbar({ user, admin = false }: { user: ShellUser; admin?: boolean }) {
  return (
    <header className="sticky top-16 z-30 border-b border-white/10 bg-[#070b13]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1540px] items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="h-10 w-full max-w-xl rounded-lg border border-white/10 bg-slate-950/70 pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-300/50 focus:ring-2 focus:ring-sky-300/10" placeholder="Search calls, agents, campaigns, reports..." />
        </div>
        <Badge tone={admin ? "warn" : "default"}>{admin ? "Admin" : user.plan?.name || "Starter"}</Badge>
        {!admin ? (
          <Link href="/pricing" className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white md:inline-flex">
            <Sparkles className="h-4 w-4" /> Upgrade
          </Link>
        ) : null}
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-100" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 hover:bg-white/[0.06]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">{user.name.slice(0, 1).toUpperCase()}</span>
          <span className="hidden text-sm font-medium text-slate-200 sm:block">{user.name.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
