import Link from "next/link";
import { AuthLayout } from "@/components/public/AuthLayout";
import { plans } from "@/lib/public-data";

export default function RegisterPage({ searchParams }: { searchParams: { plan?: string } }) {
  const selected = plans.find((plan) => plan.id === searchParams.plan) || plans[0];
  return (
    <AuthLayout title="Create your AI audit workspace" subtitle="Start with a selected plan and enter workspace details. Backend account creation will be reconnected later.">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-2xl font-semibold text-white">Start Free</h1>
        <p className="mt-2 text-sm text-slate-400">Selected plan</p>
        <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="font-semibold text-white">{selected.name} - {selected.price}/month</p>
          <p className="mt-1 text-sm text-slate-400">{selected.description}</p>
        </div>
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Full name" />
          <input className="input" placeholder="Work email" type="email" />
          <input className="input" placeholder="Company name" />
          <input className="input" placeholder="Password" type="password" />
          <Link href="/dashboard" className="block rounded-2xl bg-cyan-300 px-4 py-3 text-center font-bold text-slate-950 hover:bg-cyan-200">Create account</Link>
          <p className="text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="text-cyan-200">Login</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
}
