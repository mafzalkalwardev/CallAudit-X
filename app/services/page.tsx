import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading, ServiceCard } from "@/components/public/MarketingComponents";
import { services } from "@/lib/public-data";

export default function ServicesPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Services" title="Services for the full call transcription and audit workflow" subtitle="Each service maps to a real review step: audio replay, transcript creation, AI audit, scorecard, verification, and analytics." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div>
      </main>
    </PublicShell>
  );
}
