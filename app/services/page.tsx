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
              subtitle="From bulk call intake to transcripts, structured AI reports, scorecards, human verification, and analytics — each service is built around a real review decision."
            />
            <GlassCard className="grid gap-4 p-5 sm:grid-cols-2">
              {[
                { icon: MessageSquareText, title: "Transcript workspace", metric: "100%" },
                { icon: Bot, title: "AI audit coverage", metric: "24/7" },
                { icon: SearchCheck, title: "Reviewer verification", metric: "1 click" },
                { icon: BarChart3, title: "Performance analytics", metric: "Live" }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <item.icon className="h-5 w-5 text-[#2563EB]" />
                  <p className="mt-4 text-2xl font-bold text-[#0F172A]">{item.metric}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{item.title}</p>
                </div>
              ))}
            </GlassCard>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => <ServiceCard key={service.title} {...service} />)}
          </div>
        </section>

        <section className="bg-[#EEF3F9] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-6 md:p-8">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <StatusBadge tone="blue">Operational workflow</StatusBadge>
                  <h2 className="mt-4 text-3xl font-bold text-[#0F172A]">Services stay connected from upload to verification.</h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[#64748B]">
                  CallAudit X is designed so each service creates the next review artifact, reducing handoffs between tools and spreadsheets.
                </p>
              </div>
              <ProcessingPipeline stages={auditStages} />
            </GlassCard>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
