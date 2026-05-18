import { PublicShell } from "@/components/public/PublicShell";
import { HeroDashboardMockup } from "@/components/public/MarketingComponents";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <PublicShell footer={false}>
      <main className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_.95fr]">
        <section className="hidden items-center justify-center border-r border-white/10 px-8 py-12 lg:flex">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">CallAudit X</p>
            <h1 className="text-5xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-400">{subtitle}</p>
            <div className="mt-10"><HeroDashboardMockup /></div>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">{children}</section>
      </main>
    </PublicShell>
  );
}
