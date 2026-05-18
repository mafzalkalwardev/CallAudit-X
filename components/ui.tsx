import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn, scoreTone } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center rounded-md bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.16)] transition hover:bg-sky-200 disabled:opacity-50", className)} {...props} />;
}

export function LinkButton({ className, ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={cn("inline-flex items-center justify-center rounded-md bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.16)] transition hover:bg-sky-200", className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-xl p-5", className)} {...props} />;
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "warn" | "danger" }) {
  const tones = {
    default: "border-sky-300/25 bg-sky-300/10 text-sky-100",
    success: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    warn: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
    danger: "border-rose-300/30 bg-rose-300/10 text-rose-100"
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function StatCard({ title, value, icon: Icon, detail, trend }: { title: string; value: string | number; icon: LucideIcon; detail?: string; trend?: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">{value}</p>
          {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
        </div>
        <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-2 text-sky-200"><Icon className="h-5 w-5" /></div>
      </div>
      {trend ? <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200"><ArrowUpRight className="h-3 w-3" />{trend}</div> : null}
    </Card>
  );
}

export function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={cn("mt-2 text-3xl font-semibold", scoreTone(score))}>{score}<span className="text-base text-slate-500">/100</span></p>
      <div className="mt-3 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-gradient-to-r from-sky-300 to-indigo-300" style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
