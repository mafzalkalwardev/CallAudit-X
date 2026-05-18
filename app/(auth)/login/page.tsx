"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";

export default function LoginPage() {
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const target = mode === "admin" ? "/admin/dashboard" : "/dashboard";
  return (
    <AuthLayout title="Review every conversation with confidence" subtitle="Frontend demo login for customer and admin workspaces. Backend auth will be reconnected later.">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1">
          <button onClick={() => setMode("customer")} className={`rounded-xl px-4 py-3 text-sm font-semibold ${mode === "customer" ? "bg-cyan-300 text-slate-950" : "text-slate-400"}`}>Customer Login</button>
          <button onClick={() => setMode("admin")} className={`rounded-xl px-4 py-3 text-sm font-semibold ${mode === "admin" ? "bg-cyan-300 text-slate-950" : "text-slate-400"}`}>Admin Login</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }} className="mt-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">{mode === "admin" ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}</div>
              <div><h1 className="text-2xl font-semibold text-white">{mode === "admin" ? "Admin portal" : "Customer workspace"}</h1><p className="text-sm text-slate-500">Frontend-only navigation</p></div>
            </div>
            <div className="space-y-4">
              <input className="input" type="email" placeholder="Email address" defaultValue={mode === "admin" ? "admin@callauditx.com" : "customer@callauditx.com"} />
              <input className="input" type="password" placeholder="Password" defaultValue={mode === "admin" ? "Admin123!" : "Customer123!"} />
              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-cyan-300" /> Remember me</label>
                <Link href="/forgot-password" className="text-cyan-200">Forgot password?</Link>
              </div>
              <Link href={target} className="block rounded-2xl bg-cyan-300 px-4 py-3 text-center font-bold text-slate-950 hover:bg-cyan-200">Login</Link>
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-500">Demo hint: {mode === "admin" ? "admin@callauditx.com / Admin123!" : "customer@callauditx.com / Customer123!"}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
