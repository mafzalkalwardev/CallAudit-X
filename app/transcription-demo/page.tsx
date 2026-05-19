"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHeader, Card, Button, Badge, StatusBadge } from "@/components/ui";
import { ProcessingPipeline, type PipelineStep } from "@/components/ProcessingPipeline";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { AIReportPanel } from "@/components/AIReportPanel";
import { AudioReviewPlayer } from "@/components/AudioReviewPlayer";

// Mock data
const mockTranscript = [
  { timestamp: "00:00", speaker: "Agent" as const, text: "Thank you for calling CallAudit X. This is Sarah speaking. How can I help you today?" },
  { timestamp: "00:05", speaker: "Customer" as const, text: "Hi Sarah, I'm interested in your AI call auditing platform for our sales team." },
  { timestamp: "00:12", speaker: "Agent" as const, text: "Great! I'd be happy to walk you through our features. We specialize in automated call transcription and AI-powered quality audits." },
  { timestamp: "00:22", speaker: "Customer" as const, text: "That sounds promising. How accurate is the transcription?" },
  { timestamp: "00:28", speaker: "Agent" as const, text: "Our AI achieves 95% accuracy on English conversations. We also support multiple languages and handle background noise very well." },
  { timestamp: "00:38", speaker: "Customer" as const, text: "Impressive. And what about the audit findings? Can we customize the categories?" },
  { timestamp: "00:45", speaker: "Agent" as const, text: "Yes, absolutely. You can define custom audit categories, and our system learns from your team's corrections over time." },
  { timestamp: "00:55", speaker: "Customer" as const, text: "That's exactly what we need. Can you share pricing details?" },
  { timestamp: "01:00", speaker: "Agent" as const, text: "Of course! We have plans starting at $29/month for 50 calls, scaling up to $249/month for 10,000 calls." },
  { timestamp: "01:10", speaker: "Customer" as const, text: "Perfect. I'll discuss with my team and reach out next week." },
  { timestamp: "01:15", speaker: "Agent" as const, text: "Excellent! I'll send you a follow-up email with more details and a link to our demo. Thanks for reaching out!" }
];

const mockReport = {
  summary: "Sales call discussing CallAudit X features and pricing. Customer showed strong interest in AI-powered call auditing with custom categories and expressed intent to discuss with team.",
  category: "Sales Lead",
  categoryReason: "Customer inquired about product, requested pricing, and indicated intent to follow up with team.",
  sentiment: "Positive" as const,
  customerIntent: "Evaluate CallAudit X for team adoption",
  customerMood: "Interested and engaged",
  callOutcome: "Qualified lead, follow-up scheduled",
  recommendedAction: "Send follow-up email with pricing details and demo link within 24 hours",
  mistakes: ["Minor: Didn't mention integration capabilities", "Minor: Didn't ask about security features"],
  keywords: ["AI auditing", "transcription", "custom categories", "pricing", "demo"],
  scores: {
    agentScore: 88,
    leadQualityScore: 92,
    callQualityScore: 85,
    confidenceScore: 89
  }
};

export default function TranscriptionDemoPage() {
  const [currentStep, setCurrentStep] = useState<PipelineStep>("completed");
  const [isPlaying, setIsPlaying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "correct" | "incorrect">("pending");
  const [correctedCategory, setCorrectedCategory] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleStartDemo = () => {
    setCurrentStep("uploaded");
    setTimeout(() => setCurrentStep("preprocessing"), 500);
    setTimeout(() => setCurrentStep("transcribing"), 1500);
    setTimeout(() => setCurrentStep("analyzing"), 3000);
    setTimeout(() => setCurrentStep("completed"), 5000);
  };

  const handleVerify = (status: "correct" | "incorrect") => {
    setVerificationStatus(status);
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          eyebrow="Interactive Demo"
          title="See AI Call Auditing in Action"
          subtitle="Watch how CallAudit X transforms a real sales call into a complete audit report with AI-powered analysis and human verification."
        />

        {/* Main demo area */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Audio & Transcript & Report */}
          <div className="space-y-6">
            {/* Audio Player */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Call Recording</p>
              <AudioReviewPlayer src="/demo-audio.mp3" fileName="sales-call-demo.m4a" duration={75} />
            </div>

            {/* Processing Pipeline */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Processing Pipeline</p>
              <ProcessingPipeline currentStep={currentStep} />
              {currentStep === "completed" && (
                <Button onClick={handleStartDemo} variant="secondary" className="mt-4 w-full" disabled={currentStep === "uploading" || currentStep === "processing"}>
                  <PlayCircle className="h-4 w-4" />
                  Play Demo Again
                </Button>
              )}
            </div>

            {/* Transcript */}
            {currentStep === "completed" && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Timestamped Transcript</p>
                <TranscriptViewer lines={mockTranscript} keywords={mockReport.keywords} highlightedKeywords={["sales", "pricing", "demo"]} />
              </div>
            )}

            {/* AI Report */}
            {currentStep === "completed" && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">AI Audit Report</p>
                <AIReportPanel
                  summary={mockReport.summary}
                  category={mockReport.category}
                  categoryReason={mockReport.categoryReason}
                  sentiment={mockReport.sentiment}
                  customerIntent={mockReport.customerIntent}
                  customerMood={mockReport.customerMood}
                  callOutcome={mockReport.callOutcome}
                  recommendedAction={mockReport.recommendedAction}
                  mistakes={mockReport.mistakes}
                  scores={mockReport.scores}
                />
              </div>
            )}
          </div>

          {/* Right: Verification */}
          <div className="space-y-4">
            {!isPlaying && currentStep === "uploaded" && (
              <Card>
                <Button onClick={handleStartDemo} variant="primary" size="lg" className="w-full">
                  <PlayCircle className="h-5 w-5" />
                  Start AI Demo
                </Button>
              </Card>
            )}

            {currentStep === "completed" && (
              <>
                <Card className="border-primary/30 bg-primary/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Verification Status</p>
                  <StatusBadge status={verificationStatus === "pending" ? "pending" : verificationStatus} />
                </Card>

                {/* Verification Buttons */}
                <Card>
                  <p className="text-sm font-semibold mb-4 text-slate-100">Verify AI Results</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleVerify("correct")}
                      variant={verificationStatus === "correct" ? "primary" : "outline"}
                      className="w-full"
                    >
                      ✓ AI Review is Correct
                    </Button>
                    <Button
                      onClick={() => handleVerify("incorrect")}
                      variant={verificationStatus === "incorrect" ? "primary" : "outline"}
                      className="w-full"
                    >
                      ✗ I Have a Correction
                    </Button>
                  </div>
                </Card>

                {/* Correction Form */}
                {verificationStatus === "incorrect" && (
                  <Card className="border-warning/30 bg-warning/5">
                    <p className="text-sm font-semibold mb-4 text-slate-100">Submit Correction</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
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
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                          Feedback (optional)
                        </label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Why did you correct this classification?"
                          className="input min-h-20 resize-none"
                        />
                      </div>
                      <Button variant="primary" className="w-full" disabled={!correctedCategory}>
                        Submit Correction
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Features highlights */}
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Key Features</p>
                  <div className="space-y-2">
                    {[
                      "95% transcription accuracy",
                      "Real-time AI analysis",
                      "Custom category support",
                      "Human verification loop",
                      "Analytics & insights",
                      "Bulk upload ready"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* CTA */}
                <Button href="/register?plan=pro" variant="secondary" size="lg" className="w-full">
                  Try CallAudit X Free
                </Button>
              </>
            )}

            {/* Processing state */}
            {(currentStep === "preprocessing" || currentStep === "transcribing" || currentStep === "analyzing") && (
              <Card className="border-secondary/30 bg-secondary/5">
                <div className="text-center py-4">
                  <p className="text-sm font-semibold text-secondary">
                    {currentStep === "preprocessing" && "Preprocessing audio..."}
                    {currentStep === "transcribing" && "Transcribing call..."}
                    {currentStep === "analyzing" && "Analyzing with AI..."}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Feature showcase */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold text-slate-100 mb-2">📝 Smart Transcription</h3>
            <p className="text-sm text-soft">Get accurate, timestamped transcripts with speaker detection and noise filtering.</p>
          </Card>
          <Card>
            <h3 className="font-semibold text-slate-100 mb-2">🤖 AI Analysis</h3>
            <p className="text-sm text-soft">Automatic category detection, sentiment analysis, and audit scoring in seconds.</p>
          </Card>
          <Card>
            <h3 className="font-semibold text-slate-100 mb-2">✓ Human Verification</h3>
            <p className="text-sm text-soft">Review findings, submit corrections, and teach the AI for continuous improvement.</p>
          </Card>
        </div>

        {/* CTA section */}
        <div className="mt-16 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Ready to Audit Calls at Scale?</h2>
          <p className="mx-auto max-w-2xl text-soft mb-8">Start with 50 free calls on our Starter plan. No credit card required.</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button href="/register?plan=starter" variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button href="/how-it-works" variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
