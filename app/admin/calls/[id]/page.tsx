import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { Badge, Card, LinkButton, PageHeader, ScoreCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { isNoLiveConversation, noLiveConversationMessage, noLiveConversationRecommendation } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminCallDetailPage({ params }: { params: { id: string } }) {
  const call = await prisma.call.findUnique({
    where: { id: params.id },
    include: { user: true, report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
  });
  if (!call) notFound();
  const report = call.report;
  const isAutomated = report && isNoLiveConversation(report.category.name);
  return (
    <>
      <PageHeader title={call.title} subtitle={`${call.user.email} | ${call.createdAt.toLocaleString()}`} action={<LinkButton href={`/api/calls/${call.id}/report`}>Download report</LinkButton>} />
      {isAutomated ? (
        <Card className="mb-6 border-[#D97706]/20 bg-[#FFFBEB]">
          <h2 className="font-bold text-[#92400E]">{noLiveConversationMessage}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#B45309]">{noLiveConversationRecommendation}</p>
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card><h2 className="mb-4 font-semibold">Audio</h2><AudioPlayer src={call.audioUrl} /></Card>
          {report ? <Card><div className="flex flex-wrap gap-2"><Badge>{report.category.name}</Badge><Badge>{report.sentiment}</Badge><Badge>{call.verification?.status || "pending"}</Badge></div><h2 className="mt-5 text-xl font-semibold text-[#0F172A]">AI report</h2><p className="mt-2 text-sm font-medium leading-6 text-[#334155]">{report.summary}</p><div className="mt-5"><TranscriptViewer lines={(report.transcriptSegments || report.transcript) as any} keywords={report.keywords} /></div></Card> : null}
          {call.verification?.status === "incorrect" ? <Card><h2 className="font-semibold text-[#0F172A]">Corrected AI mistake</h2><p className="mt-3 text-[#334155]">Correct category: {call.verification.correctedCategory?.name || "Not selected"}</p><p className="mt-2 text-[#64748B]">{call.verification.feedback}</p></Card> : null}
        </div>
        <div className="space-y-4">
          <Card><p className="text-sm text-[#64748B]">Customer</p><p className="mt-1 font-medium text-[#0F172A]">{call.user.name}</p><p className="text-sm text-[#64748B]">{call.user.email}</p></Card>
          {report ? <><ScoreCard label="Agent score" score={isAutomated ? "N/A" : report.agentScore} /><ScoreCard label="Lead quality" score={isAutomated ? "N/A" : report.leadQualityScore} /><ScoreCard label="AI confidence" score={isAutomated ? "N/A" : report.confidenceScore} /></> : null}
        </div>
      </div>
    </>
  );
}
