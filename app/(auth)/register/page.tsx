"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard } from "@/components/public/MarketingComponents";
import { plans } from "@/lib/public-data";

export default function RegisterPage({ searchParams }: { searchParams: { plan?: string } }) {
  const router = useRouter();
  const planParam = searchParams.plan === "growth" ? "pro" : searchParams.plan;
  const selected = plans.find((plan) => plan.id === planParam) || plans[0];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, password, plan: selected.id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push(data.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your workspace and analyze your first call free." 
      subtitle="Start with the selected plan, invite your team later, and gain immediate access to AI-powered call insights."
    >
      <GlassCard className="w-full max-w-xl p-6" glow>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Get Started Free</h1>
            <p className="mt-1.5 text-sm text-[#64748B]">Set up your intelligent call audit workstation in seconds.</p>
          </div>
          <Link href="/pricing" className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition">
            Change plan
          </Link>
        </div>

        {/* Selected Plan Details (High Contrast & Premium) */}
        <div className="mt-6 rounded-xl border border-[#2563EB]/25 bg-[#EFF6FF] p-5 shadow-[0_2px_12px_rgba(37,99,235,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Selected plan</p>
              <h2 className="mt-1.5 text-xl font-extrabold text-[#0F172A]">{selected.name}</h2>
              <p className="mt-1.5 text-sm text-[#64748B]">{selected.description}</p>
            </div>
            <p className="text-3xl font-extrabold text-[#2563EB] tracking-tight">
              {selected.price}
              <span className="text-sm font-normal text-[#64748B]">/month</span>
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 border-t border-[#2563EB]/15 pt-3">
            {selected.features.slice(0, 4).map((feature) => (
              <p key={feature} className="flex items-center gap-2 text-sm font-medium text-[#334155]">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
                {feature}
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-4 text-sm text-[#DC2626] font-semibold">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Full name *</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                placeholder="Alex Morgan" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Company name</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                placeholder="Horizon Support" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Work email *</span>
            <input 
              className="input bg-white border border-[#D8E1EE]" 
              placeholder="alex@company.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Password *</span>
            <input 
              className="input bg-white border border-[#D8E1EE]" 
                placeholder="Min 8 characters" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white transition hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating your account...
              </>
            ) : (
              <>
                Create account & Get Started
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#64748B] pt-2 border-t border-[#EEF3F9]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
              Login here
            </Link>
          </p>
        </form>
      </GlassCard>
    </AuthLayout>
  );
}
