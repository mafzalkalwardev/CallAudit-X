import { Activity, CheckCircle2, ShieldCheck } from "lucide-react";
import { HeroDashboardPreview, StatusBadge } from "@/components/public/MarketingComponents";
import { PublicShell } from "@/components/public/PublicShell";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <PublicShell footer={false}>
      <main className="grid min-h-[calc(100vh-5rem)] bg-[#030712] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden border-r border-[rgba(148,163,184,0.16)] px-8 py-12 lg:flex lg:items-center">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.10)_0%,transparent_34%,rgba(59,130,246,0.08)_100%)]" />
          <div className="relative mx-auto max-w-2xl">
            <StatusBadge tone="cyan">Secure demo workspace</StatusBadge>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-[#F8FAFC]">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-[#94A3B8]">{subtitle}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Activity, label: "Bulk calls", value: "428" },
                { icon: CheckCircle2, label: "Verified", value: "94%" },
                { icon: ShieldCheck, label: "AI confidence", value: "88%" }
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[#0B1220]/80 p-4">
                  <item.icon className="h-4 w-4 text-[#22D3EE]" />
                  <p className="mt-3 text-2xl font-semibold text-[#F8FAFC]">{item.value}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <HeroDashboardPreview />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">{children}</section>
      </main>
    </PublicShell>
  );
}
