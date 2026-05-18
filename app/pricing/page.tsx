import { PublicShell } from "@/components/public/PublicShell";
import { PricingCard, SectionHeading } from "@/components/public/MarketingComponents";
import { plans } from "@/lib/public-data";

export default function PricingPage() {
  const comparison = ["Calls per month", "AI transcript", "AI audit report", "Audio playback", "Advanced analytics", "Verification workflow", "Admin console", "Priority support"];

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Pricing" title="Choose the plan that matches your monthly audit volume" subtitle="Plans are organized around how many calls you transcribe, audit, verify, and report on each month." />
        <div className="mx-auto mt-10 inline-flex rounded-2xl border border-white/10 bg-slate-900/70 p-1 text-sm">
          <button className="rounded-xl bg-cyan-300 px-5 py-2 font-bold text-slate-950">Monthly</button>
          <button className="px-5 py-2 font-semibold text-slate-400">Yearly</button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PricingCard key={plan.id} plan={plan} highlighted={plan.id === "pro"} />)}</div>
        <p className="mt-8 text-center text-sm text-slate-500">Stripe checkout will be connected in backend phase.</p>
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-white/[0.03] text-left text-slate-400"><tr><th className="p-5">Feature</th><th>Starter</th><th>Pro</th><th>Business</th></tr></thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {comparison.map((feature, index) => (
                <tr key={feature}><td className="p-5 font-medium text-white">{feature}</td><td>{index < 4 ? "Included" : "-"}</td><td>{index < 6 ? "Included" : "-"}</td><td>Included</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </PublicShell>
  );
}
