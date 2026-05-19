import { PageHeader, Card, Badge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Award, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="Manage your call auditor identity, security preferences, and subscription tier."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-[#F5F7FB]">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 text-3xl font-bold text-[#2563EB] shadow-sm">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#0F172A]">{user.name}</h2>
          <p className="mt-1 text-sm text-[#64748B] capitalize">{user.role.toLowerCase()}</p>
          
          <div className="mt-6 w-full pt-6 border-t border-[#D8E1EE]">
            <Badge tone="default" size="lg" className="w-full justify-center">
              <Award className="mr-1.5 h-4 w-4" />
              {user.plan?.name || "Starter"} Plan
            </Badge>
          </div>
        </Card>

        <Card className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] border-b border-[#EEF3F9] pb-3">Account Details</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Role Access</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold text-[#334155]">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
