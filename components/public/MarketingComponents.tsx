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
  blue: "border-[#2563EB]/25 bg-[#2563EB]/8 text-[#2563EB]",
  cyan: "border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0369A1]",
  success: "border-[#16A34A]/25 bg-[#16A34A]/8 text-[#15803D]",
  warning: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309]",
  danger: "border-[#DC2626]/25 bg-[#DC2626]/8 text-[#DC2626]",
  neutral: "border-[#D8E1EE] bg-[#F5F7FB] text-[#64748B]"
};

const dotStyles: Record<StatusTone, string> = {
  blue: "bg-[#2563EB]",
  cyan: "bg-[#0EA5E9]",
  success: "bg-[#16A34A]",
  warning: "bg-[#F59E0B]",
  danger: "bg-[#DC2626]",
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
        <div className={cn("mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider", toneStyles.blue)}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-3xl font-bold text-[#0F172A] md:text-4xl leading-tight">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-[#64748B] md:text-lg">{subtitle}</p> : null}
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
        "relative overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white shadow-sm",
        glow ? "shadow-[0_4px_24px_rgba(37,99,235,0.10)]" : null,
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent" />
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
    <div className="rounded-xl border border-[#D8E1EE] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">{value}</p>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg border", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-[#64748B]">{detail}</p> : null}
    </div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

export function ServiceCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6" glow>
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
            <Icon className="h-5 w-5" />
          </div>
          <StatusBadge tone="cyan">AI ready</StatusBadge>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">{description}</p>
      </GlassCard>
    </motion.div>
  );
}

export function AITranscriptPreview({ compact = false }: { compact?: boolean }) {
  const rows = [
    { time: "00:04", speaker: "Agent", tone: "blue" as StatusTone, text: "Thanks for calling Horizon Support. I see you uploaded three call batches today." },
    { time: "00:18", speaker: "Customer", tone: "cyan" as StatusTone, text: "We need to know which conversations need manager review before tomorrow morning." },
    { time: "00:42", speaker: "Agent", tone: "blue" as StatusTone, text: "I can prioritize complaints, low confidence scores, and calls where the outcome is unclear." },
    { time: "01:09", speaker: "Customer", tone: "warning" as StatusTone, text: "One customer sounded frustrated about billing, so flag that as a complaint." }
  ];

  return (
    <GlassCard className={cn("p-5", compact ? "p-4" : "p-5")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8E1EE] pb-4">
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">AI transcript</p>
          <p className="mt-1 text-xs text-[#64748B]">Timestamped speaker turns with audit cues</p>
        </div>
        <StatusBadge tone="success">Transcription complete</StatusBadge>
      </div>
      <div className={cn("mt-4 space-y-3", compact ? "text-xs" : "text-sm")}>
        {rows.map((row) => (
          <div key={`${row.time}-${row.speaker}`} className="grid grid-cols-[58px_92px_1fr] items-start gap-3 rounded-xl border border-[#EEF3F9] bg-[#F5F7FB] p-3 max-sm:grid-cols-1">
            <span className="font-mono text-xs text-[#94A3B8] mt-0.5">{row.time}</span>
            <span className={cn("w-fit text-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", toneStyles[row.tone])}>{row.speaker}</span>
            <p className="leading-6 text-[#334155]">{row.text}</p>
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
        <div className="overflow-hidden rounded-xl border border-[#D8E1EE] bg-[#F5F7FB]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8E1EE] bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
              </div>
              <p className="text-sm font-semibold text-[#0F172A]">CallAudit X command center</p>
            </div>
            <StatusBadge tone="success">Live processing</StatusBadge>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Agent score" value="91%" detail="Coaching ready" icon={Gauge} tone="success" />
                <StatCard label="AI confidence" value="88%" detail="Human check queued" icon={Bot} tone="cyan" />
              </div>

              <div className="rounded-xl border border-[#D8E1EE] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Audit volume</p>
                    <p className="mt-1 text-xs text-[#64748B]">Calls processed today</p>
                  </div>
                  <span className="text-2xl font-bold text-[#2563EB]">428</span>
                </div>
                <div className="mt-5 flex h-20 items-end gap-1.5">
                  {bars.map((height, index) => (
                    <span key={index} className="w-full rounded-t bg-gradient-to-t from-[#2563EB] to-[#0EA5E9]" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#D8E1EE] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0F172A]">Processing queue</p>
                  <StatusBadge tone="warning">3 flagged</StatusBadge>
                </div>
                <div className="mt-4 space-y-3">
                  {queue.map(([file, category, confidence]) => (
                    <div key={file} className="flex items-center justify-between gap-3 rounded-lg bg-[#F5F7FB] px-3 py-2 text-xs">
                      <span className="min-w-0 truncate text-[#334155]">{file}</span>
                      <span className="shrink-0 text-[#64748B]">{category}</span>
                      <span className="shrink-0 font-semibold text-[#2563EB]">{confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AITranscriptPreview compact />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#16A34A]/25 bg-[#F0FDF4] p-3">
                  <p className="text-xs font-semibold text-[#15803D]">Verified</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">327</p>
                </div>
                <div className="rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] p-3">
                  <p className="text-xs font-semibold text-[#B45309]">Needs review</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">41</p>
                </div>
                <div className="rounded-xl border border-[#DC2626]/25 bg-[#FEF2F2] p-3">
                  <p className="text-xs font-semibold text-[#DC2626]">Complaints</p>
                  <p className="mt-2 text-2xl font-bold text-[#0F172A]">18</p>
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
          <motion.div key={stage.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-[#2563EB]">{stage.label}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#0F172A]">{stage.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">{stage.description}</p>
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
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="h-full">
      <GlassCard
        className={cn("flex h-full flex-col p-6", highlighted ? "border-[#2563EB] ring-2 ring-[#2563EB]/20" : null)}
        glow={highlighted}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#0F172A]">{plan.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">{plan.description}</p>
          </div>
          {highlighted ? <StatusBadge tone="blue">Popular</StatusBadge> : null}
        </div>
        <p className="mt-7 text-4xl font-bold text-[#0F172A]">
          {plan.price}
          <span className="text-sm font-normal text-[#64748B]">/month</span>
        </p>
        <ul className="my-7 space-y-3 text-sm text-[#334155]">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/register?plan=${plan.id}`}
          className={cn(
            "mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
            highlighted
              ? "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.28)] hover:bg-[#1D4ED8]"
              : "border border-[#D8E1EE] bg-[#F5F7FB] text-[#0F172A] hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
          )}
        >
          Start with {plan.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </GlassCard>
    </motion.div>
  );
}

export function ReviewCard({ 
  quote, 
  name, 
  role, 
  company, 
  photoUrl, 
  rating = 5, 
  companyBadge 
}: { 
  quote: string; 
  name: string; 
  role: string; 
  company: string;
  photoUrl?: string;
  rating?: number;
  companyBadge?: string;
}) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-[#EFF6FF] text-[#2563EB]", "bg-[#F0FDF4] text-[#15803D]", "bg-[#FFF7ED] text-[#C2410C]", "bg-[#F5F3FF] text-[#7C3AED]", "bg-[#FEF9EC] text-[#B45309]", "bg-[#F0FAFA] text-[#0F766E]"];
  const colorIdx = name.charCodeAt(0) % colors.length;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <GlassCard className="h-full p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 text-[#F59E0B]">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            {companyBadge ? (
              <span className="rounded-md border border-[#2563EB]/25 bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                {companyBadge}
              </span>
            ) : null}
          </div>
          <p className="mt-5 text-sm leading-7 text-[#334155] italic">&ldquo;{quote}&rdquo;</p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-[#EEF3F9] pt-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={photoUrl} 
              alt={name} 
              className="h-10 w-10 rounded-full object-cover border border-[#D8E1EE]"
              onError={(e) => {
                // Remove img element fallback to initials
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold", colors[colorIdx])}>
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#0F172A] text-sm truncate">{name}</p>
            <p className="text-xs text-[#64748B] truncate">
              {role} • <span className="font-semibold">{company}</span>
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export const HeroDashboardMockup = HeroDashboardPreview;
export const AuditPipeline = ProcessingPipeline;
