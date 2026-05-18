"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Bot, Brain, Building2, CheckCircle2, Cloud, FileAudio, Gauge, Headphones, Layers3, Lock, MessageSquareText, SearchCheck, ShieldCheck, Sparkles, Star, Tags, UploadCloud } from "lucide-react";

const iconMap = {
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

export function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-8 text-slate-400 md:text-lg">{subtitle}</p> : null}
    </motion.div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 transition">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Icon className="h-5 w-5" /></div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </motion.div>
  );
}

export function ServiceCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const Icon = iconMap[icon as IconName] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -7, scale: 1.01 }} className="group rounded-2xl bg-gradient-to-br from-cyan-300/30 via-blue-600/20 to-purple-600/30 p-px">
      <div className="h-full rounded-2xl bg-slate-950/90 p-6 transition group-hover:bg-slate-900/90">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-cyan-300"><Icon className="h-5 w-5" /></div>
        <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}

export function PricingCard({ plan, highlighted = false }: { plan: { id: string; name: string; price: string; features: string[]; description: string }; highlighted?: boolean }) {
  return (
    <motion.div whileHover={{ y: -8 }} className={highlighted ? "relative rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-600 to-purple-600 p-px shadow-2xl shadow-cyan-500/15" : "rounded-2xl border border-white/10 bg-slate-900/70"}>
      <div className={highlighted ? "rounded-2xl bg-slate-950 p-6" : "p-6"}>
        {highlighted ? <span className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">Most popular</span> : null}
        <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
        <p className="mt-6 text-4xl font-semibold text-white">{plan.price}<span className="text-sm font-normal text-slate-500">/month</span></p>
        <ul className="my-7 space-y-3 text-sm text-slate-300">
          {plan.features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{feature}</li>)}
        </ul>
        <Link href={`/register?plan=${plan.id}`} className={highlighted ? "block rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-cyan-200" : "block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"}>Start with {plan.name}</Link>
      </div>
    </motion.div>
  );
}

export function ReviewCard({ quote, name, role, company }: { quote: string; name: string; role: string; company: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
      <div className="flex gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
      <p className="mt-5 text-sm leading-7 text-slate-300">"{quote}"</p>
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-slate-500">{role}, {company}</p>
      </div>
    </motion.div>
  );
}

export function HeroDashboardMockup() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-2xl shadow-cyan-950/40">
      <div className="absolute -left-8 top-10 hidden rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl lg:block">
        <p className="text-xs text-slate-500">Transcript</p>
        <p className="mt-1 text-2xl font-semibold text-cyan-300">Ready</p>
      </div>
      <div className="absolute -right-8 bottom-14 hidden rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl lg:block">
        <p className="text-xs text-slate-500">AI audit</p>
        <p className="mt-1 text-sm font-semibold text-emerald-300">Verified correct</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div><p className="text-sm font-semibold text-white">AI Call Audit Workbench</p><p className="text-xs text-slate-500">Audio, transcript, report, and verification in one view</p></div>
          <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">Processing complete</span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {["Agent score 91", "Lead quality 84", "AI confidence 96%"].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">{item}</div>)}
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              <div className="h-2 w-2 rounded-full bg-amber-300" />
              <div className="h-2 w-2 rounded-full bg-emerald-300" />
              <span className="ml-2 text-xs text-slate-500">call-0428-sales-lead.wav</span>
            </div>
            <div className="mb-5 flex h-14 items-center gap-1 rounded-lg bg-cyan-300/5 px-3">
              {[28, 52, 36, 72, 44, 80, 35, 64, 48, 88, 42, 68, 32, 76, 40, 58, 30, 84].map((height, index) => <span key={index} className="w-full rounded bg-cyan-300/70" style={{ height: `${height}%` }} />)}
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[56px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"><span className="font-mono text-xs text-slate-500">00:12</span><p className="text-slate-300">Agent: Thanks for calling. What are you trying to solve today?</p></div>
              <div className="grid grid-cols-[56px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"><span className="font-mono text-xs text-slate-500">00:31</span><p className="text-slate-300">Customer: We need better call QA and lead scoring for our sales team.</p></div>
              <div className="grid grid-cols-[56px_1fr] gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"><span className="font-mono text-xs text-slate-500">01:04</span><p className="text-slate-300">Agent: I can send a demo recap and schedule a follow-up.</p></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">AI Summary</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Qualified sales lead asking for call QA, analytics, and agent scoring.</p>
            </div>
            {["Category: Sales Lead", "Sentiment: Positive", "Mistake: No budget confirmed", "Next action: Schedule product demo"].map((row) => <div key={row} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{row}</div>)}
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm font-semibold text-emerald-200">Reviewer status: Verified correct</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AuditPipeline({ stages }: { stages: { label: string; title: string; description: string }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {stages.map((stage) => (
        <motion.div key={stage.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <span className="text-sm font-semibold text-cyan-300">{stage.label}</span>
          <h3 className="mt-4 text-lg font-semibold text-white">{stage.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{stage.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
