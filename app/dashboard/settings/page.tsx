import { PageHeader, Card, Button } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, Bell, Lock, Key, Volume2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage your call evaluation tolerances, security details, and QA alerts."
      />

      <div className="grid gap-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#EEF3F9] pb-4">
            <div className="p-2 bg-[#EFF6FF] text-[#2563EB] rounded-lg">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">AI Calibration Preferences</h2>
              <p className="text-sm text-[#64748B]">Adjust dynamic evaluator margins and transcription filters.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Default Language</span>
                <select className="input bg-white border border-[#D8E1EE]" defaultValue="en-US">
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                  <option value="fr-FR">French (France)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Agent Score Sensitivity</span>
                <select className="input bg-white border border-[#D8E1EE]" defaultValue="standard">
                  <option value="low">Lenient (Low evaluation rigor)</option>
                  <option value="standard">Balanced (Standard compliance)</option>
                  <option value="high">Strict (Enterprise QA tolerance)</option>
                </select>
              </label>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#EEF3F9] pb-4">
            <div className="p-2 bg-[#EFF6FF] text-[#2563EB] rounded-lg">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">QA Notifications</h2>
              <p className="text-sm text-[#64748B]">Choose when to receive real-time dashboard notifications.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="accent-[#2563EB] h-4 w-4 mt-0.5 rounded" defaultChecked />
              <div>
                <span className="block text-sm font-semibold text-[#334155]">Upload & Audio Processing</span>
                <span className="block text-xs text-[#64748B]">Get notified immediately when a file finishes transcribing.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="accent-[#2563EB] h-4 w-4 mt-0.5 rounded" defaultChecked />
              <div>
                <span className="block text-sm font-semibold text-[#334155]">Audit Report Generated</span>
                <span className="block text-xs text-[#64748B]">Receive notifications when the AI generates scorecards.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="accent-[#2563EB] h-4 w-4 mt-0.5 rounded" defaultChecked />
              <div>
                <span className="block text-sm font-semibold text-[#334155]">Billing & Plan Thresholds</span>
                <span className="block text-xs text-[#64748B]">Receive renewal alerts and billing reports.</span>
              </div>
            </label>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#EEF3F9] pb-4">
            <div className="p-2 bg-[#EFF6FF] text-[#2563EB] rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Security Preferences</h2>
              <p className="text-sm text-[#64748B]">Review token auth parameters and password limits.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#334155]">Password Update</p>
              <p className="text-xs text-[#64748B]">To change your login credentials, please trigger the forgot-password flow from the portal.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
