import Link from "next/link";
import { ArrowUpRight, AlertCircle, CheckCircle2, Clock, Loader2, LucideIcon, X } from "lucide-react";
import { cn, scoreTone } from "@/lib/utils";

/* ============================================================================
   BUTTONS
   ============================================================================ */

export function Button({ className, variant = "primary", size = "md", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "danger"; size?: "sm" | "md" | "lg" }) {
  const variants = {
    primary: "bg-primary hover:bg-blue-500 text-slate-950 font-semibold shadow-lg shadow-primary/20",
    secondary: "bg-secondary hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-secondary/20",
    outline: "border border-slate-500 text-primary hover:bg-primary/10",
    danger: "bg-danger hover:bg-red-600 text-white font-semibold shadow-lg shadow-danger/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({ className, variant = "primary", size = "md", ...props }: React.ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "outline" | "danger"; size?: "sm" | "md" | "lg" }) {
  const variants = {
    primary: "bg-primary hover:bg-blue-500 text-slate-950 font-semibold shadow-lg shadow-primary/20",
    secondary: "bg-secondary hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-secondary/20",
    outline: "border border-slate-500 text-primary hover:bg-primary/10",
    danger: "bg-danger hover:bg-red-600 text-white font-semibold shadow-lg shadow-danger/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-all",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

/* ============================================================================
   CARDS
   ============================================================================ */

export function Card({ className, elevated = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { elevated?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/30 p-6 shadow-card",
        elevated && "border-slate-700/50 bg-slate-900/40 shadow-card-lg from-slate-800/50 to-slate-900/40",
        className
      )}
      {...props}
    />
  );
}

export function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-700/30 bg-slate-900/20 p-6 backdrop-blur-xl shadow-card",
        className
      )}
      {...props}
    />
  );
}

/* ============================================================================
   BADGES & STATUS
   ============================================================================ */

export function Badge({ children, tone = "default", size = "md" }: { children: React.ReactNode; tone?: "default" | "success" | "warn" | "danger" | "info"; size?: "sm" | "md" | "lg" }) {
  const tones = {
    default: "border-primary/30 bg-primary/10 text-primary",
    success: "border-success/30 bg-success/10 text-success",
    warn: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
    info: "border-secondary/30 bg-secondary/10 text-secondary"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border font-medium", tones[tone], sizes[size])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "pending" | "correct" | "incorrect" | "processing" | "completed" | "failed" }) {
  const statuses = {
    pending: { tone: "warn" as const, label: "Pending Review", icon: Clock },
    correct: { tone: "success" as const, label: "Verified Correct", icon: CheckCircle2 },
    incorrect: { tone: "danger" as const, label: "Corrected", icon: X },
    processing: { tone: "info" as const, label: "Processing", icon: Loader2 },
    completed: { tone: "success" as const, label: "Completed", icon: CheckCircle2 },
    failed: { tone: "danger" as const, label: "Failed", icon: AlertCircle }
  };

  const item = statuses[status];
  const Icon = item.icon;

  return (
    <Badge tone={item.tone} size="md">
      <Icon className={cn("mr-1 h-3 w-3", status === "processing" && "animate-spin")} />
      {item.label}
    </Badge>
  );
}

/* ============================================================================
   STAT & SCORE CARDS
   ============================================================================ */

export function StatCard({
  title,
  value,
  icon: Icon,
  detail,
  trend,
  trendDirection = "up"
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  detail?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}) {
  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted"
  };

  return (
    <Card elevated>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{title}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-slate-100">{value}</p>
          {detail && <p className="mt-2 text-sm text-soft">{detail}</p>}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/30">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-4 inline-flex items-center gap-1 rounded-lg border border-success/20 bg-success/5 px-2 py-1 text-xs font-medium", trendColors[trendDirection])}>
          <ArrowUpRight className="h-3 w-3" />
          {trend}
        </div>
      )}
    </Card>
  );
}

export function ScoreCard({ label, score, size = "md" }: { label: string; score: number; size?: "sm" | "md" | "lg" }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "from-success to-emerald-500";
    if (s >= 60) return "from-warning to-amber-500";
    return "from-danger to-red-500";
  };

  const sizes = {
    sm: { container: "p-3", label: "text-xs", score: "text-2xl" },
    md: { container: "p-4", label: "text-xs", score: "text-3xl" },
    lg: { container: "p-6", label: "text-sm", score: "text-4xl" }
  };

  return (
    <Card className={sizes[size].container}>
      <p className={cn("font-medium uppercase tracking-wider text-muted", sizes[size].label)}>{label}</p>
      <p className={cn("mt-2 font-bold tracking-tight", sizes[size].score)}>
        <span className="text-slate-100">{score}</span>
        <span className="text-sm text-muted">/100</span>
      </p>
      <div className="mt-3 h-2.5 rounded-full bg-slate-800/50">
        <div className={cn("h-full rounded-full bg-gradient-to-r", getScoreColor(score))} style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}

/* ============================================================================
   PAGE HEADER
   ============================================================================ */

export function PageHeader({ title, subtitle, action, eyebrow }: { title: string; subtitle?: string; action?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="flex-1">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-soft">{subtitle}</p>}
      </div>
      {action && <div className="flex gap-3">{action}</div>}
    </div>
  );
}

/* ============================================================================
   EMPTY STATE
   ============================================================================ */

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-xl border border-slate-700/30 bg-slate-900/20 p-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ============================================================================
   LOADING SKELETON
   ============================================================================ */

export function LoadingSkeleton({ className = "h-12 w-full" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-slate-800/50", className)} />;
}

export function SkeletonCard() {
  return (
    <Card>
      <LoadingSkeleton className="mb-4 h-4 w-1/3" />
      <LoadingSkeleton className="mb-2 h-8 w-2/3" />
      <LoadingSkeleton className="h-4 w-full" />
    </Card>
  );
}
