import { PageHeader, Card, Badge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, ShieldAlert, Award, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Administrator Profile"
        subtitle="Manage your platform supervisor settings and role properties."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-[#FEF2F2] border-[#DC2626]/20">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#FEF2F2] border border-[#DC2626]/20 text-3xl font-bold text-[#DC2626] shadow-sm">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#0F172A]">{user.name}</h2>
          <p className="mt-1 text-sm text-[#DC2626] font-semibold uppercase tracking-wider">{user.role}</p>
          
          <div className="mt-6 w-full pt-6 border-t border-[#D8E1EE]">
            <Badge tone="danger" size="lg" className="w-full justify-center">
              <ShieldAlert className="mr-1.5 h-4 w-4" />
              Platform Supervisor
            </Badge>
          </div>
        </Card>

        <Card className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] border-b border-[#EEF3F9] pb-3">Administrative Credentials</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Supervisor Name</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Security Email</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Authorization Level</p>
                  <p className="text-sm font-semibold text-[#334155]">{user.role} ACCESS</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F7FB] border border-[#D8E1EE] rounded-lg text-[#64748B]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Role Active Since</p>
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
