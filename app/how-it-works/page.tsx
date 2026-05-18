import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/MarketingComponents";
import { workflow } from "@/lib/public-data";

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How It Works" title="The AI transcription and call audit loop" subtitle="CallAudit X follows the full review path: audio evidence, timestamped transcript, AI audit report, scorecard, human verification, and analytics." />
        <div className="relative mt-16">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-300 via-blue-600 to-purple-600 md:block" />
          <div className="space-y-6">
            {workflow.map((step, index) => (
              <div key={step.title} className="relative grid gap-5 rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-[80px_1fr]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-lg font-black text-slate-950 md:mx-auto">{index + 1}</div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                  <p className="mt-2 leading-7 text-slate-400">{step.description}</p>
                  {index >= 3 && index <= 6 ? <p className="mt-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">Call audit stage</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
