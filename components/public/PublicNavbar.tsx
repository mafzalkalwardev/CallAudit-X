"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/pricing", label: "Pricing" },
  { href: "/transcription-demo", label: "Live Demo" }
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8E1EE] bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB] shadow-sm">
            <Activity className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-bold text-[#0F172A]">CallAudit X</span>
            <span className="block text-xs font-medium text-[#64748B]">AI call auditing</span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#D8E1EE] bg-[#F5F7FB] px-2 py-2 text-sm font-medium text-[#64748B] lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("rounded-full px-4 py-2 transition hover:text-[#0F172A]", active ? "bg-white text-[#0F172A] shadow-sm font-semibold" : null)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-[#64748B] transition hover:bg-[#F5F7FB] hover:text-[#0F172A]">
            Login
          </Link>
          <Link href="/register" className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#1D4ED8]">
            Start Free
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#D8E1EE] text-[#0F172A] lg:hidden hover:bg-[#F5F7FB]"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#D8E1EE] bg-white lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn("rounded-xl px-3 py-3 text-sm font-semibold text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0F172A]", pathname === item.href ? "bg-[#EFF6FF] text-[#2563EB]" : null)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#0F172A]">
                Login
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#2563EB] px-3 py-3 text-center text-sm font-bold text-white hover:bg-[#1D4ED8]">
                Start Free
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
