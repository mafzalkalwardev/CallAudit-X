import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard, StatusBadge } from "@/components/public/MarketingComponents";
import { plans } from "@/lib/public-data";

export default function RegisterPage({ searchParams }: { searchParams: { plan?: string } }) {
  const selected = plans.find((plan) => plan.id === searchParams.plan) || plans[0];

  return (
    <AuthLayout title="Create your AI audit workspace" subtitle="Start with the selected plan, invite your team later, and continue into the customer dashboard demo.">
      <GlassCard className="w-full max-w-xl p-6" glow>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusBadge tone="cyan">Frontend-only signup</StatusBadge>
            <h1 className="mt-4 text-3xl font-semibold text-[#F8FAFC]">Start Free</h1>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Create a demo workspace using the plan selected from pricing.</p>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-[#22D3EE] hover:text-cyan-100">
            Change plan
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-[#22D3EE]/25 bg-[#22D3EE]/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#94A3B8]">Selected plan</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#F8FAFC]">{selected.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{selected.description}</p>
            </div>
            <p className="text-3xl font-semibold text-[#F8FAFC]">
              {selected.price}
              <span className="text-sm font-normal text-[#94A3B8]">/month</span>
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {selected.features.slice(0, 4).map((feature) => (
              <p key={feature} className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                {feature}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Full name</span>
            <input className="input" placeholder="Alex Morgan" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Work email</span>
            <input className="input" placeholder="alex@company.com" type="email" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Company name</span>
            <input className="input" placeholder="Horizon Support" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#F8FAFC]">Password</span>
            <input className="input" placeholder="Create a password" type="password" />
          </label>

          <Link href="/dashboard" className="flex items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-4 py-3 font-bold text-[#030712] transition hover:bg-cyan-200">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-center text-sm text-[#94A3B8]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#22D3EE] hover:text-cyan-100">
              Login
            </Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
