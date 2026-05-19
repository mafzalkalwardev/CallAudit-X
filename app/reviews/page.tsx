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
            subtitle="Real stories from sales, support, and QA teams who replaced manual reviews with AI-powered audit workflows."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: CheckCircle2, value: "4.9/5", label: "Average quality rating", tone: "success" as const },
              { icon: Clock, value: "64%", label: "Less manual review time", tone: "blue" as const },
              { icon: BarChart3, value: "3.2x", label: "More calls audited weekly", tone: "cyan" as const }
            ].map((item) => (
              <GlassCard key={item.label} className="p-6 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-4xl font-bold text-[#0F172A]">{item.value}</p>
                <p className="mt-2 text-sm text-[#64748B]">{item.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => <ReviewCard key={review.name} {...review} />)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <GlassCard className="p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <StatusBadge tone="neutral">Customer teams</StatusBadge>
                <h2 className="mt-4 text-3xl font-bold text-[#0F172A]">Built for sales, support, QA, and operations teams.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#64748B]">
                The platform workflow mirrors a real path from audio transcript to verified audit analytics. Every call becomes a coaching artifact.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {mockCompanies.map((company, index) => {
                const colors = [
                  "from-[#2563EB] to-[#0EA5E9]",
                  "from-[#10B981] to-[#059669]",
                  "from-[#F59E0B] to-[#D97706]",
                  "from-[#8B5CF6] to-[#7C3AED]",
                  "from-[#EC4899] to-[#DB2777]",
                  "from-[#06B6D4] to-[#0891B2]"
                ];
                return (
                  <div key={company} className="flex items-center justify-center gap-2.5 rounded-xl border border-[#D8E1EE] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-200">
                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-tr ${colors[index % colors.length]} shrink-0`} />
                    <span className="font-sans font-extrabold tracking-tight text-[#0F172A] text-xs">
                      {company}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </section>
      </main>
    </PublicShell>
  );
}
