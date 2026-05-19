"use client";

import { useState } from "react";
import { CheckCircle2, Mic, PlayCircle, RefreshCcw } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { GlassCard, SectionHeading, StatusBadge } from "@/components/public/MarketingComponents";
import { Card, Button, Badge } from "@/components/ui";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { AIReportPanel } from "@/components/AIReportPanel";
import { ProcessingPipeline, type PipelineStep } from "@/components/ProcessingPipeline";

// --- Sample call data ---
const salesCall = {
  label: "Sales Call",
  fileName: "sales-call-demo.m4a",
  audioSrc: "/sample-audio/sales-call.wav",
  transcript: [
    { timestamp: "00:00", speaker: "Agent" as const, text: "Thank you for calling CallAudit X. This is Sarah speaking. How can I help you today?" },
    { timestamp: "00:05", speaker: "Customer" as const, text: "Hi Sarah, I'm interested in your AI call auditing platform for our sales team." },
    { timestamp: "00:12", speaker: "Agent" as const, text: "Great! We specialize in automated call transcription and AI-powered quality audits. What's your current call volume?" },
    { timestamp: "00:22", speaker: "Customer" as const, text: "About 200 calls per week. How accurate is the transcription?" },
    { timestamp: "00:28", speaker: "Agent" as const, text: "Our AI achieves 95% accuracy on English conversations and handles background noise very well." },
    { timestamp: "00:38", speaker: "Customer" as const, text: "Impressive. Can we customize the audit categories?" },
    { timestamp: "00:45", speaker: "Agent" as const, text: "Yes, absolutely. You can define custom audit categories, and our system learns from your team's corrections over time." },
    { timestamp: "00:55", speaker: "Customer" as const, text: "That's exactly what we need. Can you share pricing details?" },
    { timestamp: "01:00", speaker: "Agent" as const, text: "Of course! Plans start at $29/month for 50 calls, scaling up to $249/month for 10,000 calls." },
    { timestamp: "01:10", speaker: "Customer" as const, text: "Perfect. I'll discuss with my team and reach out next week." },
    { timestamp: "01:15", speaker: "Agent" as const, text: "I'll send you a follow-up email with details and a demo link. Thanks for reaching out!" }
  ],
  report: {
    summary: "Sales call discussing CallAudit X features and pricing. Customer showed strong interest with intent to follow up after internal discussion.",
    category: "Sales Lead",
    categoryReason: "Customer inquired about product, requested pricing, and indicated intent to follow up with team.",
    sentiment: "Positive" as const,
    customerIntent: "Evaluate CallAudit X for team adoption",
    customerMood: "Interested and engaged",
    callOutcome: "Qualified lead, follow-up scheduled",
    recommendedAction: "Send follow-up email with pricing details and demo link within 24 hours",
    mistakes: ["Minor: Didn't mention integration capabilities", "Minor: Didn't ask about security requirements"],
    keywords: ["AI auditing", "transcription", "custom categories", "pricing", "demo"],
    scores: { agentScore: 88, leadQualityScore: 92, callQualityScore: 85, confidenceScore: 89 }
  }
};

const supportCall = {
  label: "Support Call",
  fileName: "support-call-demo.wav",
  audioSrc: "/sample-audio/support-call.wav",
  transcript: [
    { timestamp: "00:00", speaker: "Agent" as const, text: "Thank you for calling support. This is Mike. How can I assist you today?" },
    { timestamp: "00:06", speaker: "Customer" as const, text: "Hi, I'm having trouble with my dashboard. The analytics page isn't loading." },
    { timestamp: "00:14", speaker: "Agent" as const, text: "I'm sorry to hear that. Let me check your account. Can I get your email?" },
    { timestamp: "00:20", speaker: "Customer" as const, text: "It's john@example.com." },
    { timestamp: "00:24", speaker: "Agent" as const, text: "I can see your account. It looks like there may be a caching issue. Have you tried clearing your browser cache?" },
    { timestamp: "00:34", speaker: "Customer" as const, text: "No, I haven't. Let me try that now." },
    { timestamp: "00:45", speaker: "Customer" as const, text: "That worked! The analytics page is loading now. Thank you so much!" },
    { timestamp: "00:50", speaker: "Agent" as const, text: "Glad to hear it! Is there anything else I can help you with today?" }
  ],
  report: {
    summary: "Support call about analytics page not loading. Issue resolved by clearing browser cache.",
    category: "Support",
    categoryReason: "Customer reported a technical issue that was resolved during the call.",
    sentiment: "Positive" as const,
    customerIntent: "Resolve dashboard loading issue",
    customerMood: "Satisfied after resolution",
    callOutcome: "Issue resolved during call",
    recommendedAction: "Monitor for recurring cache issues across customer accounts",
    mistakes: ["Minor: Didn't proactively mention cache clearing as first step"],
    keywords: ["dashboard", "analytics", "cache", "loading", "resolved"],
    scores: { agentScore: 91, leadQualityScore: 20, callQualityScore: 88, confidenceScore: 94 }
  }
};

const voicemailCall = {
  label: "Voicemail / No Answer",
  fileName: "voicemail-no-answer-demo.mp3",
  audioSrc: "/sample-audio/voicemail-no-answer.wav",
  transcript: [
    { timestamp: "00:00", speaker: "Agent" as const, text: "Call connected to automated voicemail greeting." },
    { timestamp: "00:04", speaker: "Customer" as const, text: "Please leave a message after the beep." },
    { timestamp: "00:08", speaker: "Customer" as const, text: "[Beep tone]" }
  ],
  report: {
    summary: "No live conversation was detected. The audio contains an automated voicemail prompt and beep tone only.",
    category: "Voicemail",
    categoryReason: "The recording contains answering-machine language and a beep tone without a live customer-agent exchange.",
    sentiment: "Neutral" as const,
    customerIntent: "None - automated signal detected",
    customerMood: "Neutral",
    callOutcome: "No live conversation detected",
    recommendedAction: "Retry the call or upload a different recording if this should contain a live conversation.",
    mistakes: ["None - call did not reach a live agent."],
    keywords: ["voicemail", "beep tone", "no answer", "retry"],
    scores: { agentScore: "N/A", leadQualityScore: "N/A", callQualityScore: "N/A", confidenceScore: "N/A" }
  }
};

const sampleCalls = [salesCall, supportCall, voicemailCall];

export default function TranscriptionDemoPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState<PipelineStep>("completed");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "correct" | "incorrect">("pending");
  const [correctedCategory, setCorrectedCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);

  const selected = sampleCalls[selectedIdx];

  const handleStartDemo = () => {
    setCurrentStep("uploaded");
    setVerificationStatus("pending");
    setSaved(false);
    setTimeout(() => setCurrentStep("preprocessing"), 600);
    setTimeout(() => setCurrentStep("transcribing"), 1800);
    setTimeout(() => setCurrentStep("analyzing"), 3400);
    setTimeout(() => setCurrentStep("completed"), 5600);
  };

  const handleSelectCall = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentStep("completed");
    setVerificationStatus("pending");
    setSaved(false);
    setCorrectedCategory("");
    setFeedback("");
  };

  const handleSaveCorrection = () => {
    setSaved(true);
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Interactive Demo"
          title="See AI Call Auditing in Action"
          subtitle="Watch how CallAudit X transforms a real call into a complete audit report with AI-powered analysis and human verification."
        />

        {/* Sample call selector */}
        <div className="mt-8 flex flex-wrap gap-3">
          {sampleCalls.map((call, idx) => (
            <button
              key={call.label}
              onClick={() => handleSelectCall(idx)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${idx === selectedIdx ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#D8E1EE] bg-white text-[#64748B] hover:border-[#2563EB]/30 hover:text-[#0F172A]"}`}
            >
              {call.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: Processing + Transcript + Report */}
          <div className="space-y-6">
            {/* Audio player */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Call Recording</p>
                <Badge tone="info" size="sm">{selected.fileName}</Badge>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                <Mic className="h-5 w-5 text-[#2563EB]" />
                <div className="flex-1">
                  <audio className="mb-3 w-full" controls src={selected.audioSrc}>
                    <track kind="captions" />
                  </audio>
                  <div className="flex h-8 items-end gap-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-full rounded-sm bg-[#2563EB]/30"
                        style={{ height: `${20 + Math.sin(i * 0.8) * 15 + Math.cos(i * 0.3) * 10}%` }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#475569] font-medium">Demo-safe sample audio for playback and pipeline animation.</p>
                </div>
              </div>
            </Card>

            {/* Processing pipeline */}
            <Card>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Processing Pipeline</p>
              <ProcessingPipeline currentStep={currentStep} />
              {currentStep === "completed" && (
                <Button onClick={handleStartDemo} variant="outline" className="mt-4 w-full">
                  <RefreshCcw className="h-4 w-4" />
                  Replay Processing Demo
                </Button>
              )}
            </Card>

            {/* Transcript */}
            {currentStep === "completed" && (
              <Card>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Timestamped Transcript</p>
                <TranscriptViewer
                  lines={selected.transcript}
                  keywords={selected.report.keywords}
                  highlightedKeywords={selected.report.keywords.slice(0, 3)}
                />
              </Card>
            )}

            {/* AI Report */}
            {currentStep === "completed" && (
              <Card>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">AI Audit Report</p>
                <AIReportPanel
                  summary={selected.report.summary}
                  category={selected.report.category}
                  categoryReason={selected.report.categoryReason}
                  sentiment={selected.report.sentiment}
                  customerIntent={selected.report.customerIntent}
                  customerMood={selected.report.customerMood}
                  callOutcome={selected.report.callOutcome}
                  recommendedAction={selected.report.recommendedAction}
                  mistakes={selected.report.mistakes}
                  scores={selected.report.scores}
                />
              </Card>
            )}
          </div>

          {/* Right: Controls + Verification */}
          <div className="space-y-4">
            {/* Start demo */}
            {currentStep !== "completed" && (
              <Card>
                {currentStep === "uploaded" ? (
                  <Button onClick={handleStartDemo} variant="primary" size="lg" className="w-full">
                    <PlayCircle className="h-5 w-5" />
                    Start AI Processing
                  </Button>
                ) : (
                  <div className="py-4 text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
                    <p className="text-sm font-semibold text-[#2563EB]">
                      {currentStep === "preprocessing" && "Preprocessing audio..."}
                      {currentStep === "transcribing" && "Transcribing call..."}
                      {currentStep === "analyzing" && "Analyzing with AI..."}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Start demo button when completed */}
            {currentStep === "completed" && (
              <>
                <Button onClick={handleStartDemo} variant="outline" className="w-full">
                  <PlayCircle className="h-4 w-4" />
                  Start AI Demo Again
                </Button>

                {/* Verification status */}
                <Card className="border-[#2563EB]/20 bg-[#EFF6FF]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">Verification Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${verificationStatus === "pending" ? "bg-[#F59E0B]" : verificationStatus === "correct" ? "bg-[#16A34A]" : "bg-[#DC2626]"}`} />
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {verificationStatus === "pending" ? "Pending Review" : verificationStatus === "correct" ? "Approved AI" : "Correction needed"}
                    </span>
                  </div>
                </Card>

                {/* Verification buttons */}
                <Card>
                  <p className="text-sm font-semibold mb-4 text-[#0F172A]">Verify AI Results</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setVerificationStatus("correct"); setSaved(false); }}
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${verificationStatus === "correct" ? "border-[#16A34A] bg-[#F0FDF4] text-[#15803D]" : "border-[#D8E1EE] bg-white text-[#64748B] hover:border-[#16A34A]/30 hover:bg-[#F0FDF4]"}`}
                    >
                      Approve AI
                    </button>
                    <button
                      onClick={() => { setVerificationStatus("incorrect"); setSaved(false); }}
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${verificationStatus === "incorrect" ? "border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]" : "border-[#D8E1EE] bg-white text-[#64748B] hover:border-[#DC2626]/30 hover:bg-[#FEF2F2]"}`}
                    >
                      Reject AI
                    </button>
                  </div>
                </Card>

                {/* Correction form */}
                {verificationStatus === "incorrect" && (
                  <Card className="border-[#F59E0B]/30 bg-[#FFFBEB]">
                    <p className="text-sm font-semibold mb-4 text-[#0F172A]">Correct Category</p>
                    {saved ? (
                      <div className="flex items-center gap-2 rounded-xl border border-[#16A34A]/25 bg-[#F0FDF4] px-4 py-3">
                        <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                        <span className="text-sm font-semibold text-[#15803D]">Correction saved</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                            Correct Category
                          </label>
                          <select
                            value={correctedCategory}
                            onChange={(e) => setCorrectedCategory(e.target.value)}
                            className="input"
                          >
                            <option value="">Select category...</option>
                            <option value="Sales Lead">Sales Lead</option>
                            <option value="Support">Support</option>
                            <option value="Complaint">Complaint</option>
                            <option value="Product Inquiry">Product Inquiry</option>
                            <option value="Booking">Booking</option>
                            <option value="Spam">Spam / Wrong Number</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                            Feedback (optional)
                          </label>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Why did you correct this classification?"
                            className="input min-h-20 resize-none"
                          />
                        </div>
                        <Button
                          variant="primary"
                          className="w-full"
                          disabled={!correctedCategory}
                          onClick={handleSaveCorrection}
                        >
                          Submit Feedback
                        </Button>
                      </div>
                    )}
                  </Card>
                )}

                {/* Features list */}
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-4">Key Features</p>
                  <div className="space-y-2">
                    {[
                      "95% transcription accuracy",
                      "Real-time AI analysis",
                      "Custom category support",
                      "Human verification loop",
                      "Analytics & insights",
                      "Bulk upload ready"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-[#64748B]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* CTA */}
                <Button href="/register?plan=starter" variant="primary" size="lg" className="w-full">
                  Start Free — 1 call free
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Bottom feature showcase */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <GlassCard className="p-6">
            <h3 className="font-bold text-[#0F172A] mb-2">Smart Transcription</h3>
            <p className="text-sm text-[#64748B]">Accurate, timestamped transcripts with speaker detection and noise filtering.</p>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-bold text-[#0F172A] mb-2">AI Analysis</h3>
            <p className="text-sm text-[#64748B]">Automatic category detection, sentiment analysis, and audit scoring in seconds.</p>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-bold text-[#0F172A] mb-2">Human Verification</h3>
            <p className="text-sm text-[#64748B]">Review findings, submit corrections, and teach the AI for continuous improvement.</p>
          </GlassCard>
        </div>

        {/* CTA section */}
        <GlassCard className="mt-16 p-10 text-center border-[#2563EB]/20" glow>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Ready to Audit Calls at Scale?</h2>
          <p className="mx-auto max-w-2xl text-[#64748B] mb-8">Start with 1 free call on our Starter plan. No credit card required.</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button href="/register?plan=starter" variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button href="/how-it-works" variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </GlassCard>
      </main>
    </PublicShell>
  );
}
