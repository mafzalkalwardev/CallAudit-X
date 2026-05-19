"use client";

import { AlertCircle, Lightbulb, SmilePlus, Target, CheckCircle2 } from "lucide-react";
import { Card, Badge, ScoreCard } from "@/components/ui";

interface AIReportPanelProps {
  summary: string;
  category: string;
  categoryReason: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  customerIntent: string;
  customerMood: string;
  callOutcome: string;
  recommendedAction: string;
  mistakes?: string[];
  scores: {
    agentScore: number;
    leadQualityScore: number;
    callQualityScore: number;
    confidenceScore: number;
  };
}

export function AIReportPanel({ 
  summary, 
  category, 
  categoryReason, 
  sentiment, 
  customerIntent, 
  customerMood, 
  callOutcome, 
  recommendedAction, 
  mistakes = [], 
  scores 
}: AIReportPanelProps) {
  
  const sentimentColor = {
    Positive: "success",
    Neutral: "default",
    Negative: "danger"
  } as const;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-white border border-[#D8E1EE]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">AI Summary</h3>
        <p className="text-sm leading-relaxed text-[#334155] font-medium">{summary}</p>
      </Card>

      {/* Category & Sentiment */}
      <Card className="bg-white border border-[#D8E1EE]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Category</p>
            <div className="flex items-center justify-between">
              <Badge tone="info" size="lg">
                {category}
              </Badge>
            </div>
            {categoryReason && (
              <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                {categoryReason}
              </p>
            )}
          </div>
          <div className="border-t border-[#EEF3F9] pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Sentiment</p>
            <Badge tone={sentimentColor[sentiment]} size="lg">
              {sentiment}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Intent & Mood */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-[#D8E1EE]">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 flex-shrink-0 text-[#2563EB] mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer Intent</p>
              <p className="mt-2 text-sm font-semibold text-[#0F172A]">{customerIntent}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-[#D8E1EE]">
          <div className="flex items-start gap-3">
            <SmilePlus className="h-5 w-5 flex-shrink-0 text-[#2563EB] mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Customer Mood</p>
              <p className="mt-2 text-sm font-semibold text-[#0F172A]">{customerMood}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Outcome & Recommended Action */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-[#D8E1EE]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#16A34A] mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Call Outcome</p>
              <p className="mt-2 text-sm font-semibold text-[#0F172A]">{callOutcome}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-[#D8E1EE]">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 flex-shrink-0 text-[#D97706] mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Recommended Action</p>
              <p className="mt-2 text-sm font-semibold text-[#0F172A]">{recommendedAction}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mistakes */}
      {mistakes.length > 0 && (
        <Card className="border-[#DC2626]/20 bg-[#FEF2F2]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#DC2626] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#DC2626] mb-3">Issues & Mistakes Detected</p>
              <ul className="space-y-2">
                {mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#DC2626] font-semibold">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#DC2626]" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Scores */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">Performance Scores</p>
        <div className="grid gap-3 md:grid-cols-2">
          <ScoreCard label="Agent Score" score={scores.agentScore} size="sm" />
          <ScoreCard label="Lead Quality" score={scores.leadQualityScore} size="sm" />
          <ScoreCard label="Call Quality" score={scores.callQualityScore} size="sm" />
          <ScoreCard label="AI Confidence" score={scores.confidenceScore} size="sm" />
        </div>
      </div>
    </div>
  );
}
