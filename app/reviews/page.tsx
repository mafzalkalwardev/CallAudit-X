import { PublicShell } from "@/components/public/PublicShell";
import { ReviewCard, SectionHeading } from "@/components/public/MarketingComponents";
import { mockCompanies, reviews } from "@/lib/public-data";

export default function ReviewsPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Customer Reviews" title="Teams use CallAudit X to turn recordings into reviewable evidence" subtitle="Mock customer stories focused on transcription, AI audit reports, scorecards, and human verification." />
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center">
          <p className="text-6xl font-semibold text-white">4.9/5</p>
          <p className="mt-3 text-slate-400">Average rating from sales, support, and QA leaders</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reviews.map((review) => <ReviewCard key={review.name} {...review} />)}</div>
        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Mock customer logos</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">{mockCompanies.map((company) => <div key={company} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center font-semibold text-slate-300">{company}</div>)}</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {["Reduced transcript review time by 64%", "Improved AI audit verification visibility", "Standardized scorecards across call reviewers"].map((title) => <div key={title} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-6"><h3 className="font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">Case study preview for transcript-backed sales and support QA operations.</p></div>)}
        </div>
      </main>
    </PublicShell>
  );
}
