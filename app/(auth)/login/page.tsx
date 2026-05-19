"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, ShieldCheck, UserRound, Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard, StatusBadge } from "@/components/public/MarketingComponents";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = mode === "admin";

  const handleSubmit = async (e: React.FormEvent, customCredentials?: { email: string; md: "customer" | "admin" }) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    let targetEmail = email;
    let targetPassword = password;
    let targetMode = mode;

    if (customCredentials) {
      targetEmail = customCredentials.email;
      targetPassword = customCredentials.md === "admin" ? "Admin123!" : "Customer123!";
      targetMode = customCredentials.md;
      setMode(customCredentials.md);
      setEmail(targetEmail);
      setPassword(targetPassword);
    }

    if (!targetEmail || !targetPassword) {
      setError("Please enter your email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      router.push(data.redirectTo || (data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Review every conversation with confidence" 
      subtitle="Access your secure dashboard, manage high-volume transcripts, audit calls with AI, and verify scoring parameters."
    >
      <div className="w-full max-w-md">
        <GlassCard className="p-6" glow>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <StatusBadge tone={isAdmin ? "blue" : "cyan"}>
                {isAdmin ? "Enterprise Administrator" : "Auditor & Reviewer Workspace"}
              </StatusBadge>
              <h1 className="mt-4 text-2xl font-extrabold text-[#0F172A]">Welcome back</h1>
              <p className="mt-1 text-sm text-[#64748B]">Sign in to access your audit workbench.</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
              {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("customer");
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition duration-200 ${!isAdmin ? "bg-white text-[#2563EB] shadow-sm border border-[#D8E1EE]" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              Customer Console
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("admin");
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition duration-200 ${isAdmin ? "bg-white text-[#2563EB] shadow-sm border border-[#D8E1EE]" : "text-[#64748B] hover:text-[#0F172A]"}`}
            >
              Administrator Console
            </button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-4 text-sm text-[#DC2626] font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                <span>{error}</span>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Email address</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                type="email" 
                placeholder={isAdmin ? "admin@callauditx.com" : "customer@callauditx.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Password</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex items-center justify-between text-sm text-[#64748B] pb-2">
              <label className="flex items-center gap-2 font-medium cursor-pointer">
                <input type="checkbox" className="accent-[#2563EB] rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white transition hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  {isAdmin ? "Sign In to Admin Console" : "Sign In to Workspace"}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access (Bypass Buttons) */}
          <div className="mt-6 border-t border-[#EEF3F9] pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3 text-center">Quick Demo Access</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, { email: "customer@callauditx.com", md: "customer" })}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8E1EE] bg-white px-3.5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] hover:border-[#2563EB]/40 hover:text-[#2563EB] transition duration-200"
              >
                <UserRound className="h-3.5 w-3.5" />
                Login as Customer
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, { email: "admin@callauditx.com", md: "admin" })}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D8E1EE] bg-white px-3.5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#F0FDF4] hover:border-[#16A34A]/40 hover:text-[#16A34A] transition duration-200"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Login as Admin
              </button>
            </div>
          </div>
        </GlassCard>

        <p className="mt-5 text-center text-sm text-[#64748B]">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
            Sign up free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
