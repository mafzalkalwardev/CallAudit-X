import Link from "next/link";
import { ArrowRight, BarChart3, Bot, CheckCircle2, FileAudio, MessageSquareText, SearchCheck, UploadCloud } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { AITranscriptPreview, GlassCard, ProcessingPipeline, SectionHeading, StatusBadge } from "@/components/public/MarketingComponents";
import { auditStages, workflow } from "@/lib/public-data";

const workflowIcons = [UploadCloud, FileAudio, MessageSquareText, Bot, CheckCircle2, SearchCheck, BarChart3, BarChart3, SearchCheck];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              center={false}
              eyebrow="How It Works"
              title="The AI transcription and call-audit loop"
              subtitle="CallAudit X follows the full review path: audio evidence, timestamped transcript, AI audit report, scorecard, human verification, and analytics."
            />
            <AITranscriptPreview />
          </div>
        </section>

        <section className="bg-[#EEF3F9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ProcessingPipeline stages={auditStages} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <StatusBadge tone="blue">Detailed workflow</StatusBadge>
              <h2 className="mt-4 text-3xl font-bold text-[#0F172A] md:text-4xl">From recording intake to verified QA analytics</h2>
            </div>
            <Link href="/register" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] shadow-sm transition">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[#2563EB] via-[#0EA5E9] to-transparent md:block" />
            <div className="space-y-4">
              {workflow.map((step, index) => {
                const Icon = workflowIcons[index] || CheckCircle2;
                return (
                  <GlassCard key={step.title} className="p-5 md:p-6">
                    <div className="grid gap-5 md:grid-cols-[72px_1fr]">
                      <div className="relative z-10 grid h-12 w-12 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB] md:mx-auto">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">{String(index + 1).padStart(2, "0")}</span>
                          <h3 className="text-xl font-semibold text-[#0F172A]">{step.title}</h3>
                        </div>
                        <p className="mt-3 leading-7 text-[#64748B]">{step.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
