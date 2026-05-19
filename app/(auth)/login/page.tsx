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
    <AuthLayout title="Review every conversation with confidence" subtitle="Choose the customer workspace or admin console and continue into the demo experience.">
      <div className="w-full max-w-md">
        <GlassCard className="p-6" glow>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <StatusBadge tone={isAdmin ? "blue" : "cyan"}>{isAdmin ? "Admin access" : "Customer access"}</StatusBadge>
              <h1 className="mt-4 text-2xl font-bold text-[#0F172A]">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">Sign in to access your call audit workspace.</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
              {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-1">
            <button
              type="button"
              onClick={() => setMode("customer")}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${!isAdmin ? "bg-[#2563EB] text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              Customer Login
            </button>
            <button
              type="button"
              onClick={() => setMode("admin")}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${isAdmin ? "bg-[#2563EB] text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              Admin Login
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2 }} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0F172A]">Email address</span>
                <input className="input" type="email" defaultValue={isAdmin ? "admin@callauditx.com" : "customer@callauditx.com"} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0F172A]">Password</span>
                <input className="input" type="password" defaultValue={isAdmin ? "Admin123!" : "Customer123!"} />
              </label>

              <div className="flex items-center justify-between text-sm text-[#64748B]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#2563EB]" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                  Forgot password?
                </Link>
              </div>

              <Link
                href={target}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white transition hover:bg-[#1D4ED8] shadow-sm"
              >
                <LockKeyhole className="h-4 w-4" />
                {isAdmin ? "Enter Admin Dashboard" : "Enter Customer Dashboard"}
              </Link>

              <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-3">
                <p className="text-xs leading-5 text-[#64748B]">
                  <strong className="text-[#0F172A]">Demo credentials:</strong><br />
                  {isAdmin ? "admin@callauditx.com / Admin123!" : "customer@callauditx.com / Customer123!"}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        <p className="mt-5 text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
            Sign up free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
