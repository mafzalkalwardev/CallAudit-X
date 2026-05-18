import { CheckCircle2, Minus } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { GlassCard, PricingCard, SectionHeading, StatusBadge } from "@/components/public/MarketingComponents";
import { plans } from "@/lib/public-data";

const comparison = [
  ["Calls per month", "50", "500", "10,000"],
  ["AI transcript", true, true, true],
  ["AI audit report", true, true, true],
  ["Audio playback", true, true, true],
  ["AI confidence score", false, true, true],
  ["Verification workflow", false, true, true],
  ["Admin console", false, false, true],
  ["Priority support", false, true, true]
] as const;

export default function PricingPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the plan that matches your monthly audit volume"
          subtitle="Plans are organized around how many calls you transcribe, audit, verify, and report on each month."
        />

        <div className="mx-auto mt-10 flex w-fit items-center rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/80 p-1 text-sm">
          <span className="rounded-lg bg-[#22D3EE] px-5 py-2 font-bold text-[#030712]">Monthly</span>
          <span className="px-5 py-2 font-semibold text-[#94A3B8]">Yearly</span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PricingCard key={plan.id} plan={plan} highlighted={plan.id === "pro"} />)}</div>

        <div className="mt-8 text-center">
          <StatusBadge tone="warning">Stripe checkout will be connected during backend phase.</StatusBadge>
        </div>

        <GlassCard className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-[#07111F]/80 text-left text-[#94A3B8]">
              <tr>
                <th className="p-5 font-semibold">Feature</th>
                <th className="p-5 font-semibold">Starter</th>
                <th className="p-5 font-semibold">Pro</th>
                <th className="p-5 font-semibold">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.16)] text-slate-300">
              {comparison.map(([feature, starter, pro, business]) => (
                <tr key={feature} className="transition hover:bg-white/[0.03]">
                  <td className="p-5 font-medium text-[#F8FAFC]">{feature}</td>
                  {[starter, pro, business].map((value, index) => (
                    <td key={`${feature}-${index}`} className="p-5">
                      {typeof value === "boolean" ? (
                        value ? <CheckCircle2 className="h-5 w-5 text-[#10B981]" /> : <Minus className="h-5 w-5 text-[#94A3B8]" />
                      ) : (
                        <span>{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </main>
    </PublicShell>
  );
}
