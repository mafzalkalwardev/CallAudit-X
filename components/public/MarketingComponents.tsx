"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  Cloud,
  FileAudio,
  Gauge,
  Headphones,
  Layers3,
  Lock,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  UploadCloud,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Activity,
  UploadCloud,
  Bot,
  Brain,
  Tags,
  Gauge,
  SearchCheck,
  CheckCircle2,
  BarChart3,
  Lock,
  FileAudio,
  Star,
  MessageSquareText,
  ShieldCheck,
  Building2,
  Headphones,
  Layers3,
  Sparkles,
  Cloud
};

type IconName = keyof typeof iconMap;
type StatusTone = "blue" | "cyan" | "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<StatusTone, string> = {
  blue: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-blue-100",
  cyan: "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-cyan-100",
  success: "border-[#10B981]/30 bg-[#10B981]/10 text-emerald-100",
  warning: "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-amber-100",
  danger: "border-[#F43F5E]/35 bg-[#F43F5E]/10 text-rose-100",
  neutral: "border-[rgba(148,163,184,0.18)] bg-white/[0.03] text-slate-200"
};

const dotStyles: Record<StatusTone, string> = {
  blue: "bg-[#3B82F6]",
  cyan: "bg-[#22D3EE]",
  success: "bg-[#10B981]",
  warning: "bg-[#F59E0B]",
  danger: "bg-[#F43F5E]",
  neutral: "bg-[#94A3B8]"
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(center ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}
    >
      {eyebrow ? (
        <div className={cn("mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase", toneStyles.cyan)}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-3xl font-semibold text-[#F8FAFC] md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-8 text-[#94A3B8] md:text-lg">{subtitle}</p> : null}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  glow = false
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0B1220]/88 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        glow ? "shadow-[0_24px_90px_rgba(34,211,238,0.12)]" : null,
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent" />
      {children}
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold", toneStyles[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[tone])} />
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon = Activity,
  tone = "cyan"
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
  tone?: StatusTone;
}) {
  return (
    <div className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/85 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-[#94A3B8]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#F8FAFC]">{value}</p>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg border", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{detail}</p> : null}
    </div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 text-[#22D3EE]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#F8FAFC]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

export function ServiceCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6" glow>
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#3B82F6]">
            <Icon className="h-5 w-5" />
          </div>
          <StatusBadge tone="cyan">AI ready</StatusBadge>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-[#F8FAFC]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

export function AITranscriptPreview({ compact = false }: { compact?: boolean }) {
  const rows = [
    { time: "00:04", speaker: "Agent", tone: "cyan" as StatusTone, text: "Thanks for calling Horizon Support. I see you uploaded three call batches today." },
    { time: "00:18", speaker: "Customer", tone: "blue" as StatusTone, text: "We need to know which conversations need manager review before tomorrow morning." },
    { time: "00:42", speaker: "Agent", tone: "cyan" as StatusTone, text: "I can prioritize complaints, low confidence scores, and calls where the outcome is unclear." },
    { time: "01:09", speaker: "Customer", tone: "warning" as StatusTone, text: "One customer sounded frustrated about billing, so flag that as a complaint." }
  ];

  return (
    <GlassCard className={cn("p-5", compact ? "p-4" : "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.16)] pb-4">
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC]">AI transcript</p>
          <p className="mt-1 text-xs text-[#94A3B8]">Timestamped speaker turns with audit cues</p>
        </div>
        <StatusBadge tone="success">Transcription complete</StatusBadge>
      </div>
      <div className={cn("mt-4 space-y-3", compact ? "text-xs" : "text-sm")}>
        {rows.map((row) => (
          <div key={`${row.time}-${row.speaker}`} className="grid grid-cols-[58px_92px_1fr] gap-3 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#07111F]/70 p-3 max-sm:grid-cols-1">
            <span className="font-mono text-xs text-[#94A3B8]">{row.time}</span>
            <span className={cn("w-fit rounded-full border px-2 py-0.5 text-xs font-semibold", toneStyles[row.tone])}>{row.speaker}</span>
            <p className="leading-6 text-slate-200">{row.text}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function HeroDashboardPreview() {
  const bars = [44, 68, 38, 78, 56, 86, 48, 72, 62, 92, 54, 81, 45, 69];
  const queue = [
    ["support-escalation-091.wav", "Complaint", "91%"],
    ["sales-demo-128.wav", "Sales lead", "88%"],
    ["billing-follow-up-044.wav", "Support", "84%"]
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7 }}>
      <GlassCard className="p-4 md:p-5" glow>
        <div className="overflow-hidden rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#030712]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(148,163,184,0.16)] bg-[#07111F]/86 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F43F5E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              </div>
              <p className="text-sm font-semibold text-[#F8FAFC]">CallAudit X command center</p>
            </div>
            <StatusBadge tone="success">Live processing</StatusBadge>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Agent score" value="91%" detail="Coaching ready" icon={Gauge} tone="success" />
                <StatCard label="AI confidence" value="88%" detail="Human check queued" icon={Bot} tone="cyan" />
              </div>

              <div className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/72 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">Audit volume</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">Calls processed today</p>
                  </div>
                  <span className="text-2xl font-semibold text-[#22D3EE]">428</span>
                </div>
                <div className="mt-5 flex h-24 items-end gap-2">
                  {bars.map((height, index) => (
                    <span key={index} className="w-full rounded-t bg-gradient-to-t from-[#3B82F6] to-[#22D3EE]" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#07111F]/72 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#F8FAFC]">Processing queue</p>
                  <StatusBadge tone="warning">3 flagged</StatusBadge>
                </div>
                <div className="mt-4 space-y-3">
                  {queue.map(([file, category, confidence]) => (
                    <div key={file} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
                      <span className="min-w-0 truncate text-slate-300">{file}</span>
                      <span className="shrink-0 text-[#94A3B8]">{category}</span>
                      <span className="shrink-0 font-semibold text-[#22D3EE]">{confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AITranscriptPreview compact />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#10B981]/25 bg-[#10B981]/10 p-3">
                  <p className="text-xs font-semibold text-emerald-100">Verified</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F8FAFC]">327</p>
                </div>
                <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3">
                  <p className="text-xs font-semibold text-amber-100">Needs review</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F8FAFC]">41</p>
                </div>
                <div className="rounded-xl border border-[#F43F5E]/30 bg-[#F43F5E]/10 p-3">
                  <p className="text-xs font-semibold text-rose-100">Complaints</p>
                  <p className="mt-2 text-2xl font-semibold text-[#F8FAFC]">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ProcessingPipeline({ stages }: { stages: { label: string; title: string; description: string }[] }) {
  const stageIcons = [UploadCloud, MessageSquareText, Bot, SearchCheck, BarChart3];
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {stages.map((stage, index) => {
        const Icon = stageIcons[index] || Activity;
        return (
          <motion.div key={stage.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#22D3EE]/25 bg-[#22D3EE]/10 text-[#22D3EE]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-[#3B82F6]">{stage.label}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#F8FAFC]">{stage.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{stage.description}</p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}

export function PricingCard({
  plan,
  highlighted = false
}: {
  plan: { id: string; name: string; price: string; features: string[]; description: string };
  highlighted?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -7 }} transition={{ duration: 0.25 }} className="h-full">
      <GlassCard className={cn("flex h-full flex-col p-6", highlighted ? "border-[#22D3EE]/45 bg-[#0B1220]" : null)} glow={highlighted}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#F8FAFC]">{plan.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{plan.description}</p>
          </div>
          {highlighted ? <StatusBadge tone="cyan">Popular</StatusBadge> : null}
        </div>
        <p className="mt-7 text-4xl font-semibold text-[#F8FAFC]">
          {plan.price}
          <span className="text-sm font-normal text-[#94A3B8]">/month</span>
        </p>
        <ul className="my-7 space-y-3 text-sm text-slate-300">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/register?plan=${plan.id}`}
          className={cn(
            "mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
            highlighted
              ? "bg-[#22D3EE] text-[#030712] shadow-[0_16px_40px_rgba(34,211,238,0.18)] hover:bg-cyan-200"
              : "border border-[rgba(148,163,184,0.18)] bg-white/[0.03] text-[#F8FAFC] hover:border-[#22D3EE]/35 hover:bg-[#22D3EE]/10"
          )}
        >
          Start with {plan.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </GlassCard>
    </motion.div>
  );
}

export function ReviewCard({ quote, name, role, company }: { quote: string; name: string; role: string; company: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6">
        <div className="flex gap-1 text-[#F59E0B]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-200">"{quote}"</p>
        <div className="mt-6 border-t border-[rgba(148,163,184,0.16)] pt-4">
          <p className="font-semibold text-[#F8FAFC]">{name}</p>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {role}, {company}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export const HeroDashboardMockup = HeroDashboardPreview;
export const AuditPipeline = ProcessingPipeline;
