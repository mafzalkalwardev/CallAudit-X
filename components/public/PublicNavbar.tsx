"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/pricing", label: "Pricing" }
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20">CX</span>
          <span className="text-lg font-semibold tracking-tight text-white">CallAudit X</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 lg:flex">
          {nav.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">Login</Link>
          <Link href="/register" className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200">Start Free</Link>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 bg-slate-950/95 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">{item.label}</Link>)}
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">Login</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-cyan-300 px-3 py-3 text-center text-sm font-semibold text-slate-950">Start Free</Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
