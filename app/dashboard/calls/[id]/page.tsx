import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VerificationBox } from "@/components/VerificationBox";
import { Badge, Card, LinkButton, PageHeader, ScoreCard } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TranscriptSegment = {
  timestamp?: string;
  speaker?: string;
  text?: string;
};

function transcriptSegments(report: { transcript: string; transcriptSegments: unknown }) {
  if (Array.isArray(report.transcriptSegments)) return report.transcriptSegments as TranscriptSegment[];
  return report.transcript
    .split("\n")
    .filter(Boolean)
    .map((line: string, index: number) => {
      const match = line.match(/^(\d{2}:\d{2}:\d{2})\s+-\s+([^:]+):\s*(.*)$/);
      return match
        ? { timestamp: match[1], speaker: match[2], text: match[3] }
        : { timestamp: `00:00:${String(index * 18).padStart(2, "0")}`, speaker: "Speaker", text: line };
    });
}

async function loadCall(id: string) {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  return prisma.call.findFirst({
    where: { id, userId: session?.id || demoUser!.id },
    include: { report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
  });
}

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const call = await loadCall(params.id);
  if (!call) notFound();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const report = call.report;
  const segments = report ? transcriptSegments(report) : [];

  return (
    <>
      <PageHeader
        title={call.title}
        subtitle={`${call.agentName || "Unknown agent"} • ${call.campaignName || "No campaign"} • ${new Date(call.createdAt).toLocaleString()}`}
        action={<LinkButton href="/dashboard/calls" className="border border-[#D8E1EE] bg-white text-[#64748B] hover:bg-[#F5F7FB]">Back to calls</LinkButton>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Audio Review */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-[#0F172A]">Audio review</h2>
              <div className="flex flex-wrap gap-2">
                <Badge>{call.fileName}</Badge>
                <Badge tone={call.status === "failed" ? "danger" : call.status === "completed" || call.status === "analyzed" ? "success" : "warn"}>{call.status}</Badge>
              </div>
            </div>
            <AudioPlayer src={call.audioUrl} />
            {call.errorMessage ? (
              <p className="mt-3 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-3 text-sm text-[#DC2626] font-medium">
                {call.errorMessage}
              </p>
            ) : null}
          </Card>

          {/* AI Report Card */}
          {report ? (
            <Card>
              <div className="flex flex-wrap gap-2">
                <Badge>{report.category.name}</Badge>
                <Badge tone={report.sentiment === "Negative" ? "danger" : report.sentiment === "Positive" ? "success" : "warn"}>{report.sentiment}</Badge>
                <Badge tone={call.verification?.status === "correct" ? "success" : call.verification?.status === "incorrect" ? "danger" : "warn"}>{call.verification?.status || "pending"}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#0F172A]">AI summary</h2>
              <p className="mt-3 leading-7 text-[#334155]">{report.summary}</p>
              
              <div className="mt-5 rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB]">Category reason</p>
                <p className="mt-2 text-sm leading-6 text-[#334155]">
                  {report.categoryReason || "The AI selected the closest matching category based on transcript content."}
                </p>
              </div>

              <h3 className="mt-6 font-bold text-[#0F172A]">Timestamped transcript</h3>
              <div className="mt-3 space-y-3 rounded-2xl border border-[#D8E1EE] bg-[#F5F7FB] p-4 text-sm text-[#334155]">
                {segments.map((segment: TranscriptSegment, index: number) => (
                  <div key={`${segment.timestamp}-${index}`} className="grid gap-3 border-b border-[#EEF3F9] pb-3 last:border-0 last:pb-0 md:grid-cols-[92px_110px_1fr]">
                    <span className="font-mono text-xs font-semibold text-[#94A3B8]">{segment.timestamp || "--:--"}</span>
                    <span className="w-fit rounded-full border border-[#D8E1EE] bg-white px-2 py-0.5 text-xs font-bold text-[#0F172A]">
                      {segment.speaker || "Speaker"}
                    </span>
                    <p className="leading-6">{segment.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="font-bold text-[#0F172A]">AI report pending</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                This call has been uploaded but does not have a report yet. Re-run the upload flow or call the analysis endpoint for this call.
              </p>
            </Card>
          )}

          {/* Audit Findings */}
          {report ? (
            <Card>
              <h2 className="font-bold text-[#0F172A]">Audit findings</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Customer intent</p>
                  <p className="mt-2 font-medium text-[#0F172A]">{report.customerIntent}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Customer mood</p>
                  <p className="mt-2 font-medium text-[#0F172A]">{report.customerMood}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Outcome</p>
                  <p className="mt-2 font-medium text-[#0F172A]">{report.callOutcome}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">Next action</p>
                  <p className="mt-2 font-medium text-[#0F172A]">{report.recommendedAction}</p>
                </div>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Keywords</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.keywords.map((keyword) => (
                  <Badge key={keyword}>{keyword}</Badge>
                ))}
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Agent Mistakes</p>
              <ul className="mt-2 space-y-2">
                {report.mistakes.map((mistake) => (
                  <li key={mistake} className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-3 text-sm text-[#334155] leading-6">
                    {mistake}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>

        {/* Sidebar Scores & Verification Box */}
        <div className="space-y-4">
          {report ? (
            <>
              <ScoreCard label="Agent score" score={report.agentScore} />
              <ScoreCard label="Lead quality" score={report.leadQualityScore} />
              <ScoreCard label="Call quality" score={report.callQualityScore} />
              <ScoreCard label="AI confidence" score={report.confidenceScore} />
            </>
          ) : null}
          <VerificationBox callId={call.id} categories={categories} status={call.verification?.status || "pending"} />
        </div>
      </div>
    </>
  );
}
