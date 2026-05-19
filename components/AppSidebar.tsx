"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, ChevronDown, CreditCard, FileAudio, LayoutDashboard, RefreshCcw, Settings, ShieldCheck, Tags, UploadCloud, Users } from "lucide-react";
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
            { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
            { href: "/admin/calls", label: "All Calls", icon: FileAudio },
            { href: "/admin/ai-queue", label: "AI Queue", icon: Activity },
            { href: "/admin/corrections", label: "Corrections", icon: RefreshCcw },
            { href: "/admin/customers", label: "Customers", icon: Users },
            { href: "/admin/payments", label: "Payments", icon: CreditCard },
            { href: "/admin/categories", label: "Categories", icon: Tags },
            { href: "/admin/security-logs", label: "Security Logs", icon: Activity },
            { href: "/admin/settings", label: "Settings", icon: Settings }
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
        { label: "Billing", items: [{ href: "/dashboard/billing", label: "Plans & Usage", icon: CreditCard }] }
      ];

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-[#D8E1EE] bg-white p-4 shadow-sm lg:flex lg:flex-col">
      <div className="mb-5 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-3">
        <button className="flex w-full items-center justify-between gap-3 text-left">
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">CX</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#0F172A]">{admin ? "Admin Console" : "Customer Workspace"}</span>
              <span className="block truncate text-xs text-[#94A3B8]">CallAudit X</span>
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
        </button>
      </div>

      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748B] transition hover:bg-[#F5F7FB] hover:text-[#0F172A]",
                      active && "bg-[#EFF6FF] text-[#2563EB] font-semibold border border-[#DBEAFE]"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 text-[#94A3B8] group-hover:text-[#2563EB]", active && "text-[#2563EB]")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-[#D8E1EE] bg-[#F0FDF4] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[#15803D]">
            <ShieldCheck className="h-4 w-4" />
            Audit workspace
          </div>
          <p className="mt-2 text-xs leading-5 text-[#64748B]">Role-based access, local audio storage, mock-first AI, and database analytics.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-sm font-bold text-[#2563EB]">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0F172A]">{user.name}</p>
            <p className="truncate text-xs text-[#64748B]">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
