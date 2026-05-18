import { BarChart3, Bot, MessageSquareText, SearchCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { GlassCard, ProcessingPipeline, SectionHeading, ServiceCard, StatusBadge } from "@/components/public/MarketingComponents";
import { auditStages, services } from "@/lib/public-data";

export default function ServicesPage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <SectionHeading
              center={false}
              eyebrow="Services"
              title="AI call-auditing services for every step of the QA loop"
              subtitle="From bulk call intake to transcripts, structured AI reports, scorecards, human verification, and analytics, each service is built around a real review decision."
            />
            <GlassCard className="grid gap-4 p-5 sm:grid-cols-2">
              {[
                { icon: MessageSquareText, title: "Transcript workspace", metric: "100%" },
                { icon: Bot, title: "AI audit coverage", metric: "24/7" },
                { icon: SearchCheck, title: "Reviewer verification", metric: "1 click" },
                { icon: BarChart3, title: "Performance analytics", metric: "Live" }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/75 p-4">
                  <item.icon className="h-5 w-5 text-[#22D3EE]" />
                  <p className="mt-4 text-2xl font-semibold text-[#F8FAFC]">{item.metric}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">{item.title}</p>
                </div>
              ))}
            </GlassCard>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <GlassCard className="p-6 md:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <StatusBadge tone="cyan">Operational workflow</StatusBadge>
                <h2 className="mt-4 text-3xl font-semibold text-[#F8FAFC]">Services stay connected from upload to verification.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[#94A3B8]">
                CallAudit X is designed so each service creates the next review artifact, reducing handoffs between tools and spreadsheets.
              </p>
            </div>
            <ProcessingPipeline stages={auditStages} />
          </GlassCard>
        </section>
      </main>
    </PublicShell>
  );
}
