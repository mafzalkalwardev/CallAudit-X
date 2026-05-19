import Link from "next/link";
import { ArrowUpRight, AlertCircle, CheckCircle2, Clock, Loader2, LucideIcon, X } from "lucide-react";
import { cn, scoreTone } from "@/lib/utils";

/* ============================================================================
   BUTTONS
   ============================================================================ */

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-sm shadow-[#2563EB]/20",
  secondary: "bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold shadow-sm shadow-[#0EA5E9]/20",
  outline: "border border-[#D8E1EE] text-[#2563EB] hover:bg-[#EFF6FF] bg-white",
  danger: "bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold shadow-sm shadow-[#DC2626]/20"
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

const baseButtonClasses = "inline-flex items-center justify-center gap-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";

/** Button that renders as <button> or as a Next.js <Link> if href is provided */
export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}) {
  const classes = cn(baseButtonClasses, buttonVariants[variant], buttonSizes[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children as React.ReactNode}
      </Link>
    );
  }
  return <button className={classes} {...props} />;
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link
      className={cn(baseButtonClasses, buttonVariants[variant], buttonSizes[size], className)}
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
        "rounded-2xl border border-[#D8E1EE] bg-white p-6 shadow-sm",
        elevated && "shadow-md border-[#C4D2E5]",
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
        "rounded-2xl border border-[#D8E1EE] bg-white/90 p-6 backdrop-blur-xl shadow-sm",
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
    default: "border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]",
    success: "border-[#16A34A]/25 bg-[#F0FDF4] text-[#15803D]",
    warn: "border-[#F59E0B]/30 bg-[#FFFBEB] text-[#B45309]",
    danger: "border-[#DC2626]/25 bg-[#FEF2F2] text-[#DC2626]",
    info: "border-[#0EA5E9]/25 bg-[#F0F9FF] text-[#0369A1]"
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
    up: "text-[#15803D]",
    down: "text-[#DC2626]",
    neutral: "text-[#64748B]"
  };

  return (
    <Card elevated>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{value}</p>
          {detail && <p className="mt-2 text-sm text-[#64748B]">{detail}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D8E1EE] bg-[#EFF6FF]">
          <Icon className="h-5 w-5 text-[#2563EB]" />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-4 inline-flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-1 text-xs font-medium", trendColors[trendDirection])}>
          <ArrowUpRight className="h-3 w-3" />
          {trend}
        </div>
      )}
    </Card>
  );
}

export function ScoreCard({ label, score, size = "md" }: { label: string; score: number | string; size?: "sm" | "md" | "lg" }) {
  const getScoreColor = (s: number | string) => {
    if (typeof s === "string") return "from-[#94A3B8] to-[#CBD5E1]"; // Neutral color for N/A
    if (s >= 80) return "from-[#16A34A] to-[#22C55E]";
    if (s >= 60) return "from-[#F59E0B] to-[#FBBF24]";
    return "from-[#DC2626] to-[#EF4444]";
  };

  const sizes = {
    sm: { container: "p-3", label: "text-xs", score: "text-2xl" },
    md: { container: "p-4", label: "text-xs", score: "text-3xl" },
    lg: { container: "p-6", label: "text-sm", score: "text-4xl" }
  };

  return (
    <Card className={sizes[size].container}>
      <p className={cn("font-semibold uppercase tracking-wider text-[#64748B]", sizes[size].label)}>{label}</p>
      <p className={cn("mt-2 font-bold tracking-tight", sizes[size].score)}>
        <span className="text-[#0F172A]">{score}</span>
        {typeof score === "number" && <span className="text-sm text-[#94A3B8]">/100</span>}
      </p>
      <div className="mt-3 h-2.5 rounded-full bg-[#E2E8F0]">
        <div className={cn("h-full rounded-full bg-gradient-to-r", getScoreColor(score))} style={{ width: typeof score === "number" ? `${score}%` : "100%" }} />
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
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#64748B]">{subtitle}</p>}
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
      <div className="mb-4 rounded-xl border border-[#D8E1EE] bg-[#EFF6FF] p-4">
        <Icon className="h-8 w-8 text-[#2563EB]" />
      </div>
      <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#64748B]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ============================================================================
   LOADING SKELETON
   ============================================================================ */

export function LoadingSkeleton({ className = "h-12 w-full" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[#E2E8F0]", className)} />;
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
