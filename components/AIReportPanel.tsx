"use client";

import { AlertCircle, Lightbulb, SmilePlus, Target, Zap, CheckCircle2 } from "lucide-react";
import { Card, Badge, ScoreCard } from "@/components/ui";
import { cn } from "@/lib/utils";

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

export function AIReportPanel({ summary, category, categoryReason, sentiment, customerIntent, customerMood, callOutcome, recommendedAction, mistakes = [], scores }: AIReportPanelProps) {
  const sentimentColor = {
    Positive: "success",
    Neutral: "default",
    Negative: "danger"
  } as const;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">AI Summary</h3>
        <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
      </Card>

      {/* Category & Sentiment */}
      <Card>
        <div className="grid gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Category</p>
            <div className="flex items-center justify-between">
              <Badge tone="info" size="lg">
                {category}
              </Badge>
            </div>
            {categoryReason && <p className="mt-2 text-xs text-soft">{categoryReason}</p>}
          </div>
          <div className="border-t border-slate-800/30 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Sentiment</p>
            <Badge tone={sentimentColor[sentiment]} size="lg">
              {sentiment}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Intent & Mood */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Customer Intent</p>
              <p className="mt-2 text-sm text-slate-300">{customerIntent}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <SmilePlus className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Customer Mood</p>
              <p className="mt-2 text-sm text-slate-300">{customerMood}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Outcome & Recommended Action */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Call Outcome</p>
              <p className="mt-2 text-sm text-slate-300">{callOutcome}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 flex-shrink-0 text-warning mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Recommended Action</p>
              <p className="mt-2 text-sm text-slate-300">{recommendedAction}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mistakes */}
      {mistakes.length > 0 && (
        <Card className="border-danger/20 bg-danger/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-danger mb-3">Issues Detected</p>
              <ul className="space-y-2">
                {mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-danger" />
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
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Performance Scores</p>
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
