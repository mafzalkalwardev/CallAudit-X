"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, Search, Settings, Sparkles, User } from "lucide-react";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui";
import { useRouter } from "next/navigation";

type ShellUser = {
  name: string;
  email: string;
  role: Role;
  plan?: { name: string } | null;
};

export function Topbar({ user, admin = false }: { user: ShellUser; admin?: boolean }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear auth cookies by navigating to logout endpoint (safe redirect to login)
    router.push("/login");
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#D8E1EE] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1540px] items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            className="h-10 w-full max-w-xl rounded-lg border border-[#D8E1EE] bg-[#F5F7FB] pl-9 pr-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:bg-white"
            placeholder="Search calls, agents, campaigns, reports..."
          />
        </div>

        <Badge tone={admin ? "warn" : "default"}>{admin ? "Admin" : user.plan?.name || "Starter"}</Badge>

        {!admin ? (
          <Link
            href="/pricing"
            className="hidden items-center gap-2 rounded-lg border border-[#2563EB]/30 bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#DBEAFE] md:inline-flex transition"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Link>
        ) : null}

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#D8E1EE] bg-[#F5F7FB] text-[#64748B] hover:bg-[#EEF3F9] hover:text-[#0F172A] transition"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-[#D8E1EE] bg-[#F5F7FB] px-2 py-1.5 hover:bg-[#EEF3F9] transition"
            aria-label="Profile menu"
            aria-expanded={dropdownOpen}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-xs font-bold text-[#2563EB]">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-sm font-semibold text-[#0F172A] sm:block">{user.name.split(" ")[0]}</span>
            <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#D8E1EE] bg-white shadow-lg z-50">
              <div className="border-b border-[#EEF3F9] px-4 py-3">
                <p className="text-sm font-semibold text-[#0F172A]">{user.name}</p>
                <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">{user.plan?.name || "Starter"} plan</p>
              </div>
              <div className="p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0F172A] transition"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0F172A] transition"
                >
                  <Sparkles className="h-4 w-4" />
                  Billing
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0F172A] transition"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="my-1 border-t border-[#EEF3F9]" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
