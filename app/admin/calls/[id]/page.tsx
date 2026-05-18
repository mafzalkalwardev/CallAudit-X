import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Badge, Card, LinkButton, PageHeader, ScoreCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCallDetailPage({ params }: { params: { id: string } }) {
  const call = await prisma.call.findUnique({
    where: { id: params.id },
    include: { user: true, report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
  });
  if (!call) notFound();
  const report = call.report;
  return (
    <>
      <PageHeader title={call.title} subtitle={`${call.user.email} - ${call.createdAt.toLocaleString()}`} action={<LinkButton href={`/api/calls/${call.id}/report`} className="border border-white/10 bg-white/5 text-white hover:bg-white/10">Download report</LinkButton>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card><h2 className="mb-4 font-semibold">Audio</h2><AudioPlayer src={call.audioUrl} /></Card>
          {report ? <Card><div className="flex flex-wrap gap-2"><Badge>{report.category.name}</Badge><Badge>{report.sentiment}</Badge><Badge>{call.verification?.status || "pending"}</Badge></div><h2 className="mt-5 text-xl font-semibold">AI report</h2><p className="mt-2 text-slate-300">{report.summary}</p><pre className="mt-5 whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">{report.transcript}</pre></Card> : null}
          {call.verification?.status === "incorrect" ? <Card><h2 className="font-semibold">Corrected AI mistake</h2><p className="mt-3 text-slate-300">Correct category: {call.verification.correctedCategory?.name || "Not selected"}</p><p className="mt-2 text-slate-400">{call.verification.feedback}</p></Card> : null}
        </div>
        <div className="space-y-4">
          <Card><p className="text-sm text-slate-400">Customer</p><p className="mt-1 font-medium">{call.user.name}</p><p className="text-sm text-slate-400">{call.user.email}</p></Card>
          {report ? <><ScoreCard label="Agent score" score={report.agentScore} /><ScoreCard label="Lead quality" score={report.leadQualityScore} /><ScoreCard label="AI confidence" score={report.confidenceScore} /></> : null}
        </div>
      </div>
    </>
  );
}
