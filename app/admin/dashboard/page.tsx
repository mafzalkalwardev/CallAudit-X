import { Activity, BarChart3, CheckCircle2, PhoneCall, Users } from "lucide-react";
import { Card, PageHeader, StatCard } from "@/components/ui";

export default function AdminDashboardFrontendPage() {
  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Frontend preview of the admin command center. Backend metrics will be connected later." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Customers" value="248" icon={Users} detail="Mock platform users" trend="+8.2%" />
        <StatCard title="Uploaded calls" value="18,420" icon={PhoneCall} detail="Across all workspaces" trend="+14.6%" />
        <StatCard title="AI accuracy" value="94%" icon={CheckCircle2} detail="Verified reviews" />
        <StatCard title="Corrections" value="312" icon={Activity} detail="Customer feedback loop" />
      </div>
      <Card className="mt-6">
        <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-cyan-300" /><h2 className="font-semibold text-white">Platform analytics preview</h2></div>
        <div className="mt-6 grid gap-3 md:grid-cols-6">
          {[45, 62, 38, 74, 58, 86, 68, 92, 76, 81, 63, 88].map((height, index) => <div key={index} className="flex h-48 items-end rounded-xl border border-white/10 bg-white/[0.03] p-2"><div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-300" style={{ height: `${height}%` }} /></div>)}
        </div>
      </Card>
    </>
  );
}
