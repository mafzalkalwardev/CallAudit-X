import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Headphones, MessageSquareText, SearchCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import {
  AITranscriptPreview,
  FeatureCard,
  GlassCard,
  HeroDashboardPreview,
  PricingCard,
  ProcessingPipeline,
  ReviewCard,
  SectionHeading,
  StatusBadge
} from "@/components/public/MarketingComponents";
import { auditStages, features, plans, reviews, services } from "@/lib/public-data";

const heroSignals = [
  { label: "Transcription complete", tone: "success" as const, position: "lg:left-6 lg:top-6" },
  { label: "Agent score 91%", tone: "cyan" as const, position: "lg:right-5 lg:top-20" },
  { label: "Complaint detected", tone: "danger" as const, position: "lg:left-10 lg:bottom-24" },
  { label: "AI confidence 88%", tone: "blue" as const, position: "lg:right-8 lg:bottom-8" }
];

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <StatusBadge tone="cyan">AI QA for high-volume call teams</StatusBadge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-[#F8FAFC] md:text-7xl">
              AI Call Auditing Built for Teams That Handle Hundreds of Calls
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#94A3B8]">
              Upload calls in bulk, let AI transcribe every conversation, generate audit scores, verify AI reports, and track performance from one intelligent dashboard.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#22D3EE] px-6 py-3 font-bold text-[#030712] shadow-[0_18px_44px_rgba(34,211,238,0.18)] transition hover:bg-cyan-200">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.16)] bg-white/[0.03] px-6 py-3 font-semibold text-[#F8FAFC] transition hover:border-[#22D3EE]/35 hover:bg-[#22D3EE]/10">
                View Workflow
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Headphones, label: "Audio evidence", detail: "Every recording stays attached to its transcript and report." },
                { icon: SearchCheck, label: "Human verification", detail: "Reviewers approve or correct every AI audit outcome." }
              ].map((item) => (
                <GlassCard key={item.label} className="p-4">
                  <item.icon className="h-5 w-5 text-[#22D3EE]" />
                  <p className="mt-3 font-semibold text-[#F8FAFC]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#94A3B8]">{item.detail}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="relative min-h-[540px] overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-cover bg-center shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80')" }}
              role="img"
              aria-label="Customer support and analytics team workspace"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/72 to-[#07111F]/24" />
              <div className="absolute inset-x-4 bottom-4 hidden origin-bottom md:block lg:scale-[0.78] xl:scale-[0.84]">
                <HeroDashboardPreview />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
              {heroSignals.map((signal) => (
                <div key={signal.label} className={`lg:absolute ${signal.position}`}>
                  <GlassCard className="px-4 py-3">
                    <StatusBadge tone={signal.tone}>{signal.label}</StatusBadge>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <GlassCard className="p-6">
              <MessageSquareText className="h-6 w-6 text-[#22D3EE]" />
              <p className="mt-4 text-3xl font-semibold text-[#F8FAFC]">428</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Calls processed in today&apos;s QA queue</p>
            </GlassCard>
            <GlassCard className="p-6">
              <Bot className="h-6 w-6 text-[#22D3EE]" />
              <p className="mt-4 text-3xl font-semibold text-[#F8FAFC]">88%</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Average AI confidence across flagged calls</p>
            </GlassCard>
            <GlassCard className="p-6">
              <BarChart3 className="h-6 w-6 text-[#22D3EE]" />
              <p className="mt-4 text-3xl font-semibold text-[#F8FAFC]">64%</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Less time spent finding review-worthy calls</p>
            </GlassCard>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeading center={false} eyebrow="Transcript Intelligence" title="Every conversation becomes review-ready evidence" subtitle="Timestamped speaker labels make it easy for QA leads to jump from a flagged moment to the exact exchange behind it." />
            <AITranscriptPreview />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Audit Features" title="A premium workflow for transcription, scoring, and verification" subtitle="CallAudit X keeps every review artifact connected, so managers can coach from evidence instead of scattered notes." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Dashboard Preview" title="One intelligent command center for call QA" subtitle="Track transcript status, audit findings, scores, complaints, confidence, and verification from one focused workspace." />
          <div className="mt-12">
            <HeroDashboardPreview />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How It Works" title="From bulk uploads to verified performance analytics" />
          <div className="mt-12">
            <ProcessingPipeline stages={auditStages} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 font-semibold text-[#22D3EE] hover:text-cyan-100">
              View the full workflow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="Everything your audit workflow needs" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.slice(0, 4).map((service) => <FeatureCard key={service.title} {...service} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reviews" title="Trusted by teams that need transcript-backed QA" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} {...review} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Pricing" title="Plans based on monthly call-audit volume" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PricingCard key={plan.id} plan={plan} highlighted={plan.id === "pro"} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <GlassCard className="p-8 text-center md:p-12" glow>
            <StatusBadge tone="cyan">Ready for the next audit cycle</StatusBadge>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold text-[#F8FAFC] md:text-5xl">Turn your next batch of calls into verified QA decisions.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#94A3B8]">Give managers the transcript, scores, and confidence signals they need before coaching conversations begin.</p>
            <Link href="/register" className="mt-8 inline-flex rounded-xl bg-[#22D3EE] px-6 py-3 font-bold text-[#030712] hover:bg-cyan-200">
              Start Free
            </Link>
          </GlassCard>
        </section>
      </main>
    </PublicShell>
  );
}
