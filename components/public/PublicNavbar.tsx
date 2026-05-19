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
    <header className="sticky top-0 z-50 border-b border-[rgba(148,163,184,0.16)] bg-[#030712]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.16)]">
            <Activity className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[#F8FAFC]">CallAudit X</span>
            <span className="block text-xs font-medium text-[#94A3B8]">AI call auditing</span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[rgba(148,163,184,0.16)] bg-[#07111F]/72 px-2 py-2 text-sm font-medium text-[#94A3B8] lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("rounded-full px-4 py-2 transition hover:text-[#F8FAFC]", active ? "bg-white/[0.06] text-[#F8FAFC]" : null)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-[#94A3B8] transition hover:bg-white/[0.04] hover:text-[#F8FAFC]">
            Login
          </Link>
          <Link href="/register" className="rounded-xl bg-[#22D3EE] px-4 py-2 text-sm font-bold text-[#030712] shadow-[0_16px_40px_rgba(34,211,238,0.18)] transition hover:bg-cyan-200">
            Start Free
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(148,163,184,0.16)] text-[#F8FAFC] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[rgba(148,163,184,0.16)] bg-[#030712]/98 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn("rounded-xl px-3 py-3 text-sm font-semibold text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]", pathname === item.href ? "bg-white/[0.05] text-[#F8FAFC]" : null)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]">
                Login
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#22D3EE] px-3 py-3 text-center text-sm font-bold text-[#030712]">
                Start Free
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
