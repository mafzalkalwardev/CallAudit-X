import { Bot, CreditCard, Database, HardDrive } from "lucide-react";
import { Card, PageHeader, StatCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const openAIConfigured = Boolean(process.env.OPENAI_API_KEY);
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <>
      <PageHeader title="Admin Settings" subtitle="Local MVP configuration and integration readiness." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="OpenAI configured" value={openAIConfigured ? "Yes" : "No"} icon={Bot} detail={openAIConfigured ? "Real AI mode enabled" : "Fallback mock mode"} />
        <StatCard title="Stripe configured" value={stripeConfigured ? "Yes" : "No"} icon={CreditCard} detail="Checkout remains disabled until backend phase" />
        <StatCard title="Storage" value="Local" icon={HardDrive} detail="public/uploads/calls" />
        <StatCard title="Database" value="Prisma" icon={Database} detail="PostgreSQL via DATABASE_URL" />
      </div>
      
      <Card className="mt-6">
        <h2 className="font-bold text-[#0F172A]">AI Processing Mode</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          Current status: <strong className="text-[#2563EB]">{openAIConfigured ? "Real AI (OpenAI API)" : "Fallback Mock Mode"}</strong>. 
          The application strictly runs in mock-first architecture to protect api keys and prevent unwanted page-render API calls. It will only call OpenAI when a customer uploads or analyzes a call.
        </p>
      </Card>
    </>
  );
}
