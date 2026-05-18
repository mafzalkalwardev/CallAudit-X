import { BarChart3, CheckCircle2, Clock } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { GlassCard, ReviewCard, SectionHeading, StatusBadge } from "@/components/public/MarketingComponents";
import { mockCompanies, reviews } from "@/lib/public-data";

export default function ReviewsPage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="QA leaders use CallAudit X to turn recordings into reviewable evidence"
            subtitle="Mock customer stories focused on transcription, AI audit reports, scorecards, and human verification."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: CheckCircle2, value: "4.9/5", label: "Average quality rating", tone: "success" as const },
              { icon: Clock, value: "64%", label: "Less manual review time", tone: "cyan" as const },
              { icon: BarChart3, value: "3.2x", label: "More calls audited weekly", tone: "blue" as const }
            ].map((item) => (
              <GlassCard key={item.label} className="p-6 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[#22D3EE]/25 bg-[#22D3EE]/10 text-[#22D3EE]">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-4xl font-semibold text-[#F8FAFC]">{item.value}</p>
                <p className="mt-2 text-sm text-[#94A3B8]">{item.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reviews.map((review) => <ReviewCard key={review.name} {...review} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <GlassCard className="p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <StatusBadge tone="neutral">Customer teams</StatusBadge>
                <h2 className="mt-4 text-3xl font-semibold text-[#F8FAFC]">Built for sales, support, QA, and operations teams.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#94A3B8]">
                The public stories are demo content, but the workflow mirrors the real platform path from transcript to verified audit analytics.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {mockCompanies.map((company) => (
                <div key={company} className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/70 p-4 text-center font-semibold text-slate-300">
                  {company}
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      </main>
    </PublicShell>
  );
}
