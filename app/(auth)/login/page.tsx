"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard, StatusBadge } from "@/components/public/MarketingComponents";

export default function LoginPage() {
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const isAdmin = mode === "admin";
  const target = isAdmin ? "/admin/dashboard" : "/dashboard";

  return (
    <AuthLayout title="Review every conversation with confidence" subtitle="Choose the customer workspace or admin console and continue into the frontend demo experience.">
      <GlassCard className="w-full max-w-md p-6" glow>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <StatusBadge tone={isAdmin ? "blue" : "cyan"}>{isAdmin ? "Admin access" : "Customer access"}</StatusBadge>
            <h1 className="mt-4 text-3xl font-semibold text-[#F8FAFC]">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Frontend-only login routes directly to the selected workspace.</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#22D3EE]/25 bg-[#22D3EE]/10 text-[#22D3EE]">
            {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
          </div>
        </div>

        <div className="grid grid-cols-2 rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#030712] p-1">
          <button
            type="button"
            onClick={() => setMode("customer")}
            className={`rounded-lg px-4 py-3 text-sm font-bold transition ${!isAdmin ? "bg-[#22D3EE] text-[#030712]" : "text-[#94A3B8] hover:text-[#F8FAFC]"}`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`rounded-lg px-4 py-3 text-sm font-bold transition ${isAdmin ? "bg-[#22D3EE] text-[#030712]" : "text-[#94A3B8] hover:text-[#F8FAFC]"}`}
          >
            Admin Login
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Email address</span>
              <input className="input" type="email" defaultValue={isAdmin ? "admin@callauditx.com" : "customer@callauditx.com"} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Password</span>
              <input className="input" type="password" defaultValue={isAdmin ? "Admin123!" : "Customer123!"} />
            </label>

            <div className="flex items-center justify-between text-sm text-[#94A3B8]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#22D3EE]" /> Remember me
              </label>
              <Link href="/forgot-password" className="font-semibold text-[#22D3EE] hover:text-cyan-100">
                Forgot password?
              </Link>
            </div>

            <Link href={target} className="flex items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-4 py-3 font-bold text-[#030712] transition hover:bg-cyan-200">
              <LockKeyhole className="h-4 w-4" />
              {isAdmin ? "Enter Admin Dashboard" : "Enter Customer Dashboard"}
            </Link>

            <p className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/72 p-3 text-xs leading-5 text-[#94A3B8]">
              Demo credentials: {isAdmin ? "admin@callauditx.com / Admin123!" : "customer@callauditx.com / Customer123!"}
            </p>
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </AuthLayout>
  );
}
