import { notFound, redirect } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VerificationBox } from "@/components/VerificationBox";
import { Badge, Card, LinkButton, PageHeader, ScoreCard } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isNoLiveConversation } from "@/lib/categories";
import { ShieldAlert, Download, ArrowLeft } from "lucide-react";

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
  if (!session) {
    redirect("/login");
  }
  return prisma.call.findFirst({
    where: { id, userId: session.id },
    include: { report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
  });
}

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const call = await loadCall(params.id);
  if (!call) notFound();
  
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const report = call.report;
  const segments = report ? transcriptSegments(report) : [];

  const isAutomated = report && isNoLiveConversation(report.category.name);

  return (
    <>
      <PageHeader
        title={call.title}
        subtitle={`${call.agentName || "No agent assigned"} • ${call.campaignName || "No campaign"} • ${new Date(call.createdAt).toLocaleString()}`}
        action={
          <div className="flex flex-wrap gap-2.5">
            <LinkButton 
              href="/dashboard/calls" 
              className="border border-[#D8E1EE] bg-white text-[#64748B] hover:bg-[#F5F7FB]"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4 shrink-0" />
              Back to library
            </LinkButton>
            <a 
              href={`/api/calls/${call.id}/report`}
              download
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8] shadow-[0_2px_8px_rgba(37,99,235,0.15)]"
            >
              <Download className="h-4 w-4 shrink-0" />
              Download Report
            </a>
          </div>
        }
      />

      {/* Automated Call Alert Banner */}
      {isAutomated && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#D97706]/20 bg-[#FFFBEB] p-5 shadow-sm">
          <ShieldAlert className="h-6 w-6 text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-[#92400E]">No live conversation detected</h3>
            <p className="mt-1 text-sm text-[#B45309] font-semibold leading-relaxed">
              Our B2B AI pipeline analyzed this audio and classified it as an automated voicemail beep, machine response, dialer tone, or disconnected or wrong number event. Performance scoring has been bypassed for this record.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Audio Review */}
          <Card className="bg-white border border-[#D8E1EE] p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-extrabold text-[#0F172A]">Audio review</h2>
              <div className="flex flex-wrap gap-2">
                <Badge tone="default">{call.fileName}</Badge>
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
            <Card className="bg-white border border-[#D8E1EE] p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge tone="info">{report.category.name}</Badge>
                <Badge tone={report.sentiment === "Negative" ? "danger" : report.sentiment === "Positive" ? "success" : "warn"}>{report.sentiment}</Badge>
                <Badge tone={call.verification?.status === "correct" ? "success" : call.verification?.status === "incorrect" ? "danger" : "warn"}>{call.verification?.status || "pending"}</Badge>
              </div>
              <h2 className="text-xl font-extrabold text-[#0F172A] mt-5">AI summary</h2>
              <p className="mt-2.5 leading-relaxed text-[#334155] font-medium text-sm">{report.summary}</p>
              
              <div className="mt-5 rounded-xl border border-[#2563EB]/15 bg-[#EFF6FF] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Category reason</p>
                <p className="mt-2 text-sm leading-relaxed text-[#334155] font-semibold">
                  {report.categoryReason || "The AI selected the closest matching category based on transcript content."}
                </p>
              </div>

              <h3 className="mt-6 font-extrabold text-[#0F172A] text-base">Timestamped transcript</h3>
              <div className="mt-3.5 space-y-3 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4 text-sm text-[#334155]">
                {segments.map((segment: TranscriptSegment, index: number) => (
                  <div key={`${segment.timestamp}-${index}`} className="grid gap-3 border-b border-[#EEF3F9] pb-3 last:border-0 last:pb-0 md:grid-cols-[92px_110px_1fr] items-start">
                    <span className="font-mono text-xs font-bold text-[#64748B] mt-0.5">{segment.timestamp || "--:--"}</span>
                    <span className="w-fit text-center rounded-full border border-[#D8E1EE] bg-white px-2.5 py-0.5 text-xs font-bold text-[#0F172A]">
                      {segment.speaker || "Speaker"}
                    </span>
                    <p className="leading-relaxed font-medium text-[#334155]">{segment.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="bg-white border border-[#D8E1EE] p-6">
              <h2 className="font-extrabold text-[#0F172A]">AI report pending</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                This call has been uploaded but does not have a report yet. Re-run the upload flow or call the analysis endpoint for this call.
              </p>
            </Card>
          )}

          {/* Audit Findings */}
          {report ? (
            <Card className="bg-white border border-[#D8E1EE] p-6">
              <h2 className="font-extrabold text-[#0F172A]">Audit findings</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer intent</p>
                  <p className="mt-2 font-semibold text-[#0F172A] text-sm">{report.customerIntent}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer mood</p>
                  <p className="mt-2 font-semibold text-[#0F172A] text-sm">{report.customerMood}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Outcome</p>
                  <p className="mt-2 font-semibold text-[#0F172A] text-sm">{report.callOutcome}</p>
                </div>
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Next action</p>
                  <p className="mt-2 font-semibold text-[#0F172A] text-sm">{report.recommendedAction}</p>
                </div>
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#64748B]">Keywords</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {report.keywords.map((keyword) => (
                  <Badge key={keyword} tone="default">{keyword}</Badge>
                ))}
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[#64748B]">Agent Mistakes & Compliance Violations</p>
              <ul className="mt-2.5 space-y-2">
                {report.mistakes.map((mistake) => (
                  <li key={mistake} className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-3 text-sm text-[#334155] leading-relaxed font-medium">
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
              <ScoreCard label="Agent score" score={isAutomated ? "N/A" : report.agentScore} />
              <ScoreCard label="Lead quality" score={isAutomated ? "N/A" : report.leadQualityScore} />
              <ScoreCard label="Call quality" score={isAutomated ? "N/A" : report.callQualityScore} />
              <ScoreCard label="AI confidence" score={isAutomated ? "N/A" : report.confidenceScore} />
            </>
          ) : null}
          <VerificationBox callId={call.id} categories={categories} status={call.verification?.status || "pending"} />
        </div>
      </div>
    </>
  );
}
