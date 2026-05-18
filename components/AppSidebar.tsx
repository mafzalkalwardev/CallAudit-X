"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChevronDown, CreditCard, FileAudio, LayoutDashboard, ShieldCheck, Tags, UploadCloud, Users } from "lucide-react";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

type ShellUser = {
  name: string;
  email: string;
  role: Role;
  plan?: { name: string } | null;
};

export function AppSidebar({ user, admin = false }: { user: ShellUser; admin?: boolean }) {
  const pathname = usePathname();
  const groups = admin
    ? [
        {
          label: "Platform",
          items: [
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/calls", label: "All Calls", icon: FileAudio },
            { href: "/admin/customers", label: "Customers", icon: Users },
            { href: "/admin/categories", label: "Categories", icon: Tags }
          ]
        }
      ]
    : [
        {
          label: "Workspace",
          items: [
            { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
            { href: "/dashboard/upload", label: "Upload Calls", icon: UploadCloud },
            { href: "/dashboard/calls", label: "Call Library", icon: FileAudio },
            { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
          ]
        },
        { label: "Billing", items: [{ href: "/pricing", label: "Plans & Usage", icon: CreditCard }] }
      ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-white/10 bg-[#070b13]/88 p-4 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <button className="flex w-full items-center justify-between gap-3 text-left">
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-sky-300/20 bg-sky-300/10 text-sm font-semibold text-sky-100">CX</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-100">{admin ? "Admin Console" : "Customer Workspace"}</span>
              <span className="block truncate text-xs text-slate-500">CallAudit X Cloud</span>
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.055] hover:text-slate-100",
                      active && "border border-sky-300/14 bg-sky-300/10 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 text-slate-500 group-hover:text-sky-200", active && "text-sky-200")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Audit workspace
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Role-based access, local audio storage, mock-first AI, and database analytics.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
