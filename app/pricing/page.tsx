"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Minus, Phone } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
import { GlassCard, SectionHeading, StatusBadge } from "@/components/public/MarketingComponents";

const monthlyPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "For teams starting with transcript-backed call audits.",
    features: ["50 calls/month", "AI transcript", "Basic audit report", "Audio playback", "Category detection", "Email support"]
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    description: "For teams verifying AI reports and tracking quality trends.",
    popular: true,
    features: ["500 calls/month", "Advanced audit analytics", "AI confidence score", "Verification workflow", "Priority processing", "Export reports"]
  },
  {
    id: "business",
    name: "Business",
    price: 249,
    description: "For high-volume QA operations with admin governance.",
    features: ["10,000 calls/month", "Team access", "Admin console", "Advanced reports", "Custom categories", "Priority support"]
  }
];

const perMinutePricing = [
  { category: "Sales QA", price: "$0.12", desc: "Full AI audit with lead scoring and intent detection" },
  { category: "Support QA", price: "$0.08", desc: "Customer sentiment and resolution quality review" },
  { category: "Lead Qualification", price: "$0.10", desc: "Prospect intent classification and follow-up scoring" },
  { category: "Compliance Review", price: "$0.15", desc: "Regulatory language checks and compliance flag detection" },
  { category: "Appointment Review", price: "$0.07", desc: "Appointment confirmation and scheduling quality" },
  { category: "Spam/Wrong Number", price: "$0.03", desc: "Automatic non-productive call detection and filtering" }
];

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
  const [yearly, setYearly] = useState(false);

  const getPrice = (monthly: number) => {
    if (yearly) return Math.round(monthly * 0.80);
    return monthly;
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the plan that matches your monthly audit volume"
          subtitle="Plans are organized around how many calls you transcribe, audit, verify, and report on each month."
        />

        {/* Billing toggle */}
        <div className="mx-auto mt-10 flex w-fit items-center rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-1 text-sm">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-lg px-5 py-2 font-bold transition ${!yearly ? "bg-[#2563EB] text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 font-bold transition ${yearly ? "bg-[#2563EB] text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
          >
            Yearly
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${yearly ? "bg-white/20" : "border border-[#16A34A]/25 bg-[#F0FDF4] text-[#15803D]"}`}>Save 20%</span>
          </button>
        </div>

        {/* Plan cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {monthlyPlans.map((plan) => (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${plan.popular ? "border-[#2563EB] ring-2 ring-[#2563EB]/20" : "border-[#D8E1EE]"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <StatusBadge tone="blue">Most Popular</StatusBadge>
                </div>
              )}
              <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
              <p className="mt-2 text-sm text-[#64748B]">{plan.description}</p>
              <p className="mt-5 text-4xl font-bold text-[#0F172A]">
                ${getPrice(plan.price)}
                <span className="text-sm font-normal text-[#64748B]">/mo</span>
              </p>
              {yearly && <p className="text-xs text-[#15803D] mt-1">Billed ${getPrice(plan.price) * 12}/year</p>}
              <ul className="my-6 space-y-2.5 text-sm text-[#334155]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/register?plan=${plan.id}`}
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${plan.popular ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm" : "border border-[#D8E1EE] bg-[#F5F7FB] text-[#0F172A] hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#2563EB]"}`}
              >
                Start with {plan.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}

          {/* Enterprise card */}
          <div className="flex flex-col rounded-2xl border border-[#0F172A] bg-[#0F172A] p-6">
            <h3 className="text-xl font-bold text-white">Enterprise</h3>
            <p className="mt-2 text-sm text-[#94A3B8]">For enterprise-scale call operations with custom SLAs and compliance requirements.</p>
            <p className="mt-5 text-2xl font-bold text-white">Custom pricing</p>
            <ul className="my-6 space-y-2.5 text-sm text-[#94A3B8]">
              {["Unlimited calls", "Dedicated infrastructure", "SLA guarantee", "SSO/SAML auth", "Custom integrations", "Enterprise support"].map((feature) => (
                <li key={feature} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#60A5FA]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="mailto:callaudtix@gmail.com"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              Talk to Sales
            </a>
          </div>
        </div>

        {/* First call free CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#64748B]">
            🎉 <strong className="text-[#0F172A]">First call free</strong> — no credit card required. Cancel anytime.
          </p>
        </div>

        {/* Per-minute pricing */}
        <div className="mt-16">
          <SectionHeading
            eyebrow="Category-Based Pricing"
            title="Pay per minute by audit category"
            subtitle="Flexible per-minute pricing for teams that want to pay only for what they review."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {perMinutePricing.map((item) => (
              <GlassCard key={item.category} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{item.category}</h3>
                    <p className="mt-1 text-sm text-[#64748B]">{item.desc}</p>
                  </div>
                  <span className="shrink-0 text-2xl font-bold text-[#2563EB]">{item.price}<span className="text-sm font-normal text-[#64748B]">/min</span></span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Feature comparison table */}
        <GlassCard className="mt-16 overflow-x-auto">
          <h3 className="mb-4 font-bold text-[#0F172A]">Feature Comparison</h3>
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-[#F5F7FB] text-left text-[#64748B]">
              <tr>
                <th className="p-4 font-semibold">Feature</th>
                <th className="p-4 font-semibold">Starter</th>
                <th className="p-4 font-semibold">Growth</th>
                <th className="p-4 font-semibold">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9] text-[#334155]">
              {comparison.map(([feature, starter, pro, business]) => (
                <tr key={feature} className="transition hover:bg-[#F5F7FB]">
                  <td className="p-4 font-medium text-[#0F172A]">{feature}</td>
                  {[starter, pro, business].map((value, index) => (
                    <td key={`${feature}-${index}`} className="p-4">
                      {typeof value === "boolean" ? (
                        value ? <CheckCircle2 className="h-5 w-5 text-[#16A34A]" /> : <Minus className="h-5 w-5 text-[#D8E1EE]" />
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

        {/* Stripe status */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#94A3B8]">
            Stripe integration: plan buttons route to registration. No payment is collected during demo.
          </p>
        </div>
      </main>
    </PublicShell>
  );
}
