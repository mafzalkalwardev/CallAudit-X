"use client";

import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineStep = "uploaded" | "preprocessing" | "transcribing" | "analyzing" | "completed" | "failed";

const steps: { id: PipelineStep; label: string; description: string }[] = [
  { id: "uploaded", label: "Uploaded", description: "Call uploaded to system" },
  { id: "preprocessing", label: "Preprocessing", description: "Audio normalization" },
  { id: "transcribing", label: "Transcribing", description: "Speech-to-text conversion" },
  { id: "analyzing", label: "Analyzing", description: "AI audit analysis" },
  { id: "completed", label: "Completed", description: "Ready for review" }
];

interface ProcessingPipelineProps {
  currentStep: PipelineStep;
  isError?: boolean;
  errorMessage?: string;
}

export function ProcessingPipeline({ currentStep, isError = false, errorMessage }: ProcessingPipelineProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-0.5 bg-slate-800" />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isError = currentStep === "failed";

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-success bg-success/10",
                    isActive && !isError && "border-primary bg-primary/10 ring-2 ring-primary/30 animate-pulse",
                    !isActive && !isCompleted && "border-slate-700 bg-slate-800/50",
                    isError && index >= currentIndex && "border-danger bg-danger/10"
                  )}
                >
                  {isCompleted && <CheckCircle2 className="h-6 w-6 text-success" />}
                  {isActive && !isError && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                  {isError && index >= currentIndex && <AlertCircle className="h-6 w-6 text-danger" />}
                  {!isActive && !isCompleted && !isError && <Clock className="h-6 w-6 text-muted" />}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-slate-100">{step.label}</p>
                  <p className="text-sm text-soft">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-lg border border-danger/20 bg-danger/10 p-4">
          <p className="text-sm font-medium text-danger">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
