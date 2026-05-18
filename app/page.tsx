import Link from "next/link";
import { ArrowRight, FileAudio, PlayCircle, SearchCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { AuditPipeline, FeatureCard, HeroDashboardMockup, PricingCard, ReviewCard, SectionHeading } from "@/components/public/MarketingComponents";
import { auditStages, features, painPoints, plans, reviews, services, trustBadges, workflow } from "@/lib/public-data";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_.95fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">Audio transcription plus AI audit workflow</div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">Turn Every Recorded Call Into a Verified AI Audit Report</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Upload call recordings, generate timestamped transcripts, run AI quality audits, verify the findings, and watch QA analytics update from the review loop.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 hover:bg-cyan-200">Start Auditing Calls <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-semibold text-white hover:bg-white/5"><PlayCircle className="h-4 w-4" /> See Workflow</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">{trustBadges.map((badge) => <span key={badge} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">{badge}</span>)}</div>
          </div>
          <HeroDashboardMockup />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <AuditPipeline stages={auditStages} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The Problem" title="Call QA breaks when audio, transcripts, scores, and corrections live apart" subtitle="CallAudit X is designed around the actual review process, not a generic dashboard with call metrics pasted on top." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{painPoints.map((item) => <FeatureCard key={item.title} {...item} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 p-8 shadow-2xl shadow-black/30 lg:p-10">
              <SectionHeading center={false} eyebrow="The Core Workflow" title="Review the call from evidence to decision" subtitle="Every audit record keeps the original audio, transcript, AI findings, scorecard, and reviewer verification together." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: FileAudio, title: "Audio evidence", text: "Replay the uploaded call before trusting any AI conclusion." },
                { icon: SearchCheck, title: "Verified findings", text: "Mark the AI audit correct or submit a correction for accuracy tracking." }
              ].map((item) => <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-8"><item.icon className="h-8 w-8 text-cyan-300" /><h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Audit Features" title="Built for transcription, QA scoring, and human verification" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Workbench Preview" title="One screen for audio playback, transcript, audit results, and verification" subtitle="The product experience is centered on reviewing a single call deeply, then rolling verified results into analytics." />
          <div className="mt-12"><HeroDashboardMockup /></div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="Everything the audit workflow needs" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.slice(0, 4).map((service) => <FeatureCard key={service.title} {...service} />)}</div>
          <div className="mt-8 text-center"><Link href="/services" className="font-semibold text-cyan-200 hover:text-cyan-100">Explore all audit services <ArrowRight className="inline h-4 w-4" /></Link></div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Detailed Workflow" title="From upload to verified QA analytics" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">{workflow.slice(2, 8).map((step, index) => <div key={step.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"><span className="text-sm font-semibold text-cyan-300">0{index + 1}</span><h3 className="mt-4 font-semibold text-white">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p></div>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reviews" title="Trusted by teams that need transcript-backed QA" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewCard key={review.name} {...review} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Pricing" title="Plans based on how many calls you audit" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map((plan) => <PricingCard key={plan.id} plan={plan} highlighted={plan.id === "pro"} />)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-cyan-300/10 via-blue-600/10 to-purple-600/10 p-10 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">Ready to transcribe, audit, and verify every call?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">Give your team a focused AI call-review workflow built around evidence, scores, and human trust.</p>
            <Link href="/register" className="mt-8 inline-flex rounded-2xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-200">Start Free</Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
