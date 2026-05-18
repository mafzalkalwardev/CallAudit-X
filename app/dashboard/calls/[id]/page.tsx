import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VerificationBox } from "@/components/VerificationBox";
import { Badge, Card, LinkButton, PageHeader, ScoreCard } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const call = await prisma.call.findFirst({ where: { id: params.id, userId: session!.id }, include: { report: { include: { category: true } }, verification: { include: { correctedCategory: true } } } });
  if (!call) notFound();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const report = call.report;
  return (
    <>
      <PageHeader
        title={call.title}
        subtitle={`${call.agentName || "Unknown agent"} - ${call.campaignName || "No campaign"} - ${call.createdAt.toLocaleString()}`}
        action={<LinkButton href={`/api/calls/${call.id}/report`} className="border border-white/10 bg-white/5 text-white hover:bg-white/10">Download report</LinkButton>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold text-slate-100">Audio review</h2><Badge>{call.fileName}</Badge></div><AudioPlayer src={call.audioUrl} /></Card>
          {report ? <Card><div className="flex flex-wrap gap-2"><Badge>{report.category.name}</Badge><Badge tone={report.sentiment === "Negative" ? "danger" : report.sentiment === "Positive" ? "success" : "warn"}>{report.sentiment}</Badge><Badge tone={call.verification?.status === "correct" ? "success" : call.verification?.status === "incorrect" ? "danger" : "warn"}>{call.verification?.status || "pending"}</Badge></div><h2 className="mt-5 text-xl font-semibold text-slate-50">AI summary</h2><p className="mt-3 leading-7 text-slate-300">{report.summary}</p><h3 className="mt-6 font-semibold text-slate-100">Timestamped transcript</h3><div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">{report.transcript.split("\n").map((line, index) => <div key={`${line}-${index}`} className="grid gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0 md:grid-cols-[68px_1fr]"><span className="font-mono text-xs text-slate-500">00:{String(index * 18).padStart(2, "0")}</span><p>{line}</p></div>)}</div></Card> : null}
          {report ? <Card><h2 className="font-semibold text-slate-100">Audit findings</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><div className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer intent</p><p className="mt-2 text-slate-200">{report.customerIntent}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer mood</p><p className="mt-2 text-slate-200">{report.customerMood}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Outcome</p><p className="mt-2 text-slate-200">{report.callOutcome}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Next action</p><p className="mt-2 text-slate-200">{report.recommendedAction}</p></div></div><p className="mt-5 text-sm text-slate-400">Keywords</p><div className="mt-2 flex flex-wrap gap-2">{report.keywords.map((k) => <Badge key={k}>{k}</Badge>)}</div><p className="mt-5 text-sm text-slate-400">Mistakes</p><ul className="mt-2 space-y-2 text-slate-300">{report.mistakes.map((m) => <li key={m} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">{m}</li>)}</ul></Card> : null}
        </div>
        <div className="space-y-4">
          {report ? <><ScoreCard label="Agent score" score={report.agentScore} /><ScoreCard label="Lead quality" score={report.leadQualityScore} /><ScoreCard label="Call quality" score={report.callQualityScore} /><ScoreCard label="AI confidence" score={report.confidenceScore} /></> : null}
          <VerificationBox callId={call.id} categories={categories} status={call.verification?.status || "pending"} />
        </div>
      </div>
    </>
  );
}
