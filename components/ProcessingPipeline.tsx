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
        <div className="absolute left-6 top-12 h-[calc(100%-3rem)] w-0.5 bg-[#D8E1EE]" />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isErrorState = currentStep === "failed";

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-[#16A34A] bg-[#F0FDF4]",
                    isActive && !isErrorState && "border-[#2563EB] bg-[#EFF6FF] ring-4 ring-[#2563EB]/25",
                    !isActive && !isCompleted && "border-[#D8E1EE] bg-[#F5F7FB]",
                    isErrorState && index >= currentIndex && "border-[#DC2626] bg-[#FEF2F2]"
                  )}
                >
                  {isCompleted && <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />}
                  {isActive && !isErrorState && <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />}
                  {isErrorState && index >= currentIndex && <AlertCircle className="h-6 w-6 text-[#DC2626]" />}
                  {!isActive && !isCompleted && !isErrorState && <Clock className="h-6 w-6 text-[#94A3B8]" />}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <p className={cn(
                    "font-bold text-sm",
                    isActive ? "text-[#2563EB]" : isCompleted ? "text-[#0F172A]" : "text-[#64748B]"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-lg border border-[#DC2626]/20 bg-[#FEF2F2] p-4">
          <p className="text-sm font-semibold text-[#DC2626]">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
