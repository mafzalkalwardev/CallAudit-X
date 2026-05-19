import Link from "next/link";
import { ArrowRight, BarChart3, Bot, CheckCircle2, Headphones, MessageSquareText, SearchCheck, ShieldCheck, TrendingUp, Users } from "lucide-react";
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
import { auditStages, features, plans, reviews, services, mockCompanies } from "@/lib/public-data";

const businessBenefits = [
  { icon: TrendingUp, title: "Faster QA Cycles", desc: "Review 3x more calls per week with AI pre-auditing and prioritized flagging.", color: "text-[#2563EB]", bg: "bg-[#EFF6FF]", border: "border-[#DBEAFE]" },
  { icon: BarChart3, title: "Lower Review Cost", desc: "Reduce manual QA hours by up to 64% with automated transcription and scoring.", color: "text-[#0EA5E9]", bg: "bg-[#F0F9FF]", border: "border-[#BAE6FD]" },
  { icon: Users, title: "Better Agent Training", desc: "Give coaches timestamped evidence and score breakdowns for every conversation.", color: "text-[#14B8A6]", bg: "bg-[#F0FDFA]", border: "border-[#CCFBF1]" },
  { icon: SearchCheck, title: "Better Lead Detection", desc: "Flag high-value inbound leads automatically with AI intent classification.", color: "text-[#16A34A]", bg: "bg-[#F0FDF4]", border: "border-[#BBF7D0]" }
];

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <StatusBadge tone="blue">AI QA for high-volume call teams</StatusBadge>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-[#0F172A] md:text-5xl">
              AI Call Auditing Built for Teams That Handle Hundreds of Calls
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#64748B]">
              Upload calls in bulk, let AI transcribe every conversation, generate audit scores, verify AI reports, and track performance from one intelligent dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#1D4ED8]">
                Start Free — analyze 1 call free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/transcription-demo" className="inline-flex items-center gap-2 rounded-xl border border-[#D8E1EE] bg-white px-6 py-3 font-semibold text-[#0F172A] transition hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#2563EB]">
                Live Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Headphones, label: "Audio evidence", detail: "Every recording stays attached to its transcript and report." },
                { icon: SearchCheck, label: "Human verification", detail: "Reviewers approve or correct every AI audit outcome." }
              ].map((item) => (
                <GlassCard key={item.label} className="p-4">
                  <item.icon className="h-5 w-5 text-[#2563EB]" />
                  <p className="mt-3 font-semibold text-[#0F172A]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">{item.detail}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="relative min-h-[480px] overflow-hidden rounded-2xl border border-[#D8E1EE] bg-cover bg-center shadow-lg"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80')" }}
              role="img"
              aria-label="Customer support and analytics team workspace"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <HeroDashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar — company logos */}
        <section className="border-y border-[#D8E1EE] bg-[#EEF3F9] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {mockCompanies.map((company) => (
                <div key={company} className="rounded-lg border border-[#D8E1EE] bg-white px-5 py-2.5 text-sm font-bold text-[#64748B] shadow-sm">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <GlassCard className="p-6">
              <MessageSquareText className="h-6 w-6 text-[#2563EB]" />
              <p className="mt-4 text-3xl font-bold text-[#0F172A]">428</p>
              <p className="mt-2 text-sm text-[#64748B]">Calls processed in today&apos;s QA queue</p>
            </GlassCard>
            <GlassCard className="p-6">
              <Bot className="h-6 w-6 text-[#0EA5E9]" />
              <p className="mt-4 text-3xl font-bold text-[#0F172A]">88%</p>
              <p className="mt-2 text-sm text-[#64748B]">Average AI confidence across flagged calls</p>
            </GlassCard>
            <GlassCard className="p-6">
              <BarChart3 className="h-6 w-6 text-[#14B8A6]" />
              <p className="mt-4 text-3xl font-bold text-[#0F172A]">64%</p>
              <p className="mt-2 text-sm text-[#64748B]">Less time spent finding review-worthy calls</p>
            </GlassCard>
          </div>
        </section>

        {/* Waveform / Transcript preview */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeading
              center={false}
              eyebrow="Transcript Intelligence"
              title="Every conversation becomes review-ready evidence"
              subtitle="Timestamped speaker labels make it easy for QA leads to jump from a flagged moment to the exact exchange behind it."
            />
            <AITranscriptPreview />
          </div>
        </section>

        {/* Business benefits */}
        <section className="bg-[#EEF3F9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Benefits for Your Business"
              title="Why high-volume call teams choose CallAudit X"
              subtitle="24/7 AI processing means no backlog — every call gets audited, scored, and queued for human review automatically."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {businessBenefits.map((benefit) => (
                <div key={benefit.title} className={`rounded-2xl border ${benefit.border} ${benefit.bg} p-6`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                  <h3 className="mt-4 font-bold text-[#0F172A]">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Audit Features"
            title="A complete workflow for transcription, scoring, and verification"
            subtitle="CallAudit X keeps every review artifact connected, so managers can coach from evidence instead of scattered notes."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
        </section>

        {/* Dashboard preview */}
        <section className="bg-[#EEF3F9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Dashboard Preview"
              title="One intelligent command center for call QA"
              subtitle="Track transcript status, audit findings, scores, complaints, confidence, and verification from one focused workspace."
            />
            <div className="mt-12">
              <HeroDashboardPreview />
            </div>
          </div>
        </section>

        {/* Workflow timeline */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How It Works" title="From bulk uploads to verified performance analytics" />
          <div className="mt-12">
            <ProcessingPipeline stages={auditStages} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
              View the full workflow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ROI section */}
        <section className="bg-[#EEF3F9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <SectionHeading
                center={false}
                eyebrow="ROI Calculator"
                title="The math is simple"
                subtitle="If your team manually reviews 200 calls/week at 12 minutes each, that's 40 hours of QA time. CallAudit X automates 80% of that review in seconds."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Manual QA hours saved/week", value: "32h", desc: "Per team of 5 reviewers" },
                  { label: "Calls audited without manual review", value: "80%", desc: "AI handles the first pass" },
                  { label: "Average cost per call audit", value: "$0.10", desc: "Vs $2–$5 manual review" },
                  { label: "ROI timeline", value: "< 2 weeks", desc: "Most teams see savings immediately" }
                ].map((item) => (
                  <GlassCard key={item.label} className="p-5">
                    <p className="text-2xl font-bold text-[#2563EB]">{item.value}</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{item.label}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{item.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise security */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Enterprise Security"
            title="Built with enterprise-grade security from day one"
            subtitle="Your call recordings and audit data stay protected with industry-standard security practices."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "End-to-End Encrypted", desc: "All audio files and transcripts encrypted in transit and at rest." },
              { icon: CheckCircle2, title: "SOC 2 Ready", desc: "Audit controls and compliance posture aligned with SOC 2 Type II." },
              { icon: Bot, title: "GDPR Compliant", desc: "Data processing agreements available for EU customers." },
              { icon: Headphones, title: "24/7 AI Processing", desc: "Always-on transcription and auditing with 99.9% uptime SLA." }
            ].map((item) => (
              <GlassCard key={item.title} className="p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="bg-[#EEF3F9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Services" title="Everything your audit workflow needs" />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.slice(0, 4).map((service) => <FeatureCard key={service.title} {...service} />)}</div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reviews" title="Trusted by teams that need transcript-backed QA" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} {...review} />)}</div>
        </section>

        {/* Pricing preview */}
        <section className="bg-[#EEF3F9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Pricing" title="Plans based on monthly call-audit volume" />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PricingCard key={plan.id} plan={plan} highlighted={plan.id === "pro"} />)}</div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <GlassCard className="p-8 text-center md:p-12 border-[#2563EB]/20" glow>
            <StatusBadge tone="blue">Ready for the next audit cycle</StatusBadge>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold text-[#0F172A] md:text-4xl">Turn your next batch of calls into verified QA decisions.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">Give managers the transcript, scores, and confidence signals they need before coaching conversations begin.</p>
            <Link href="/register" className="mt-8 inline-flex rounded-xl bg-[#2563EB] px-6 py-3 font-bold text-white hover:bg-[#1D4ED8] shadow-sm transition">
              Start Free — 1st call free
            </Link>
          </GlassCard>
        </section>
      </main>
    </PublicShell>
  );
}
