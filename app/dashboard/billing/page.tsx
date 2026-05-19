import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, Sparkles, CheckCircle2, ShieldAlert, FileText, Landmark } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";

export const dynamic = "force-dynamic";

export default async function BillingPage({ searchParams }: { searchParams: { plan?: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const selectedPlanName = searchParams.plan || "";
  const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  // Fetch payments
  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  // Fetch user call count usage
  const callsUsed = await prisma.call.count({ where: { userId: user.id } });
  const limit = user.plan?.monthlyCallLimit || 50;
  const percentage = Math.min(100, Math.round((callsUsed / limit) * 100));

  const plansList = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  const selectedPlan = selectedPlanName
    ? plansList.find((plan) => plan.name.toLowerCase() === (selectedPlanName === "growth" ? "pro" : selectedPlanName).toLowerCase())
    : null;

  const categories = [
    { name: "Sales QA", price: 0.12, description: "Lead scoring & intent detection" },
    { name: "Support QA", price: 0.08, description: "Customer sentiment & resolution quality" },
    { name: "Lead Qualification", price: 0.10, description: "Prospect qualification & next-action scoring" },
    { name: "Compliance Review", price: 0.15, description: "Regulatory checks & trigger language flags" },
    { name: "Appointment Review", price: 0.07, description: "Booking verification & confirmation quality" },
    { name: "Spam Detection", price: 0.03, description: "Auto voicemail/beep detection & spam filtering" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Billing & Subscriptions"
        subtitle="Manage your platform limits, active subscription tiers, and review detailed invoice ledgers."
      />

      {selectedPlan ? (
        <Card className="border-[#2563EB]/20 bg-[#EFF6FF]">
          <p className="text-sm font-semibold text-[#2563EB]">Selected plan: {selectedPlan.name}</p>
          <p className="mt-1 text-xs text-[#64748B]">Review usage and checkout status below before changing plans.</p>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Current Plan + Usage */}
        <div className="md:col-span-2 space-y-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-[#F5F7FB]">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#EEF3F9]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Active subscription</p>
                <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1">{user.plan?.name || "Starter"} Plan</h2>
                <p className="text-xs text-[#64748B] mt-1.5">Your plan renews automatically every month.</p>
              </div>
              <Badge tone="success" size="lg">
                Active Tier
              </Badge>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-[#334155]">Monthly Evaluation Limit</span>
                <span className="font-bold text-[#0F172A]">{callsUsed} / {limit} calls</span>
              </div>
              <div className="h-3 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-[#64748B]">Used {percentage}% of call audit capacity. Once you hit 100%, upgrade below to continue.</p>
            </div>
          </Card>

          {/* Pricing Categories */}
          <Card className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Dynamic Evaluation Rates</h3>
              <p className="text-xs text-[#64748B]">Per-minute call auditing metrics applied during report processing.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div key={cat.name} className="p-4 rounded-xl border border-[#D8E1EE] bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">{cat.name}</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-normal">{cat.description}</p>
                  </div>
                  <span className="block mt-3 text-lg font-extrabold text-[#2563EB]">${cat.price.toFixed(2)}<span className="text-xs font-normal text-[#64748B]">/min</span></span>
                </div>
              ))}
            </div>
          </Card>

          {/* Invoices List */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EEF3F9] pb-3">
              <FileText className="h-5 w-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#0F172A]">Invoice Ledger</h3>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4 text-center">No transactions recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F5F7FB] text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    <tr>
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Plan Name</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF3F9]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F7FB] transition">
                        <td className="p-3 font-semibold text-[#0F172A] truncate max-w-[150px]">{p.stripeSessionId || p.id}</td>
                        <td className="p-3 font-semibold text-[#334155]">{p.planName}</td>
                        <td className="p-3 font-bold text-[#0F172A]">${(p.amount / 100).toFixed(2)}</td>
                        <td className="p-3">
                          <Badge tone={p.status === "paid" || p.status === "succeeded" ? "success" : "warn"}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs text-[#64748B]">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Available Upgrades */}
        <div className="md:col-span-1 space-y-6">
          <Card className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[#EEF3F9] pb-3">
              <Sparkles className="h-5 w-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#0F172A]">Available Upgrades</h3>
            </div>

            {!isStripeConfigured && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#F59E0B]/20 bg-[#FFFBEB] p-4 text-xs text-[#B45309] font-medium leading-relaxed shadow-sm">
                <ShieldAlert className="h-5 w-5 shrink-0 text-[#D97706]" />
                <div>
                  <span className="block font-bold">Stripe checkout is not configured yet.</span>
                  <span className="block mt-1">To enable production checkout, please specify STRIPE_SECRET_KEY in your environment setup.</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {plansList.map((plan) => {
                const isCurrent = user.planId === plan.id;
                return (
                  <div 
                    key={plan.id} 
                    className={`p-4 rounded-xl border transition shadow-sm ${
                      isCurrent 
                        ? "border-[#2563EB] bg-[#EFF6FF]/40 ring-2 ring-[#2563EB]/10" 
                        : "border-[#D8E1EE] bg-white hover:border-[#2563EB]/40"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0F172A]">{plan.name}</h4>
                        <p className="text-xs text-[#64748B] mt-1">{plan.monthlyCallLimit} calls / month</p>
                      </div>
                      <span className="text-base font-extrabold text-[#0F172A]">${(plan.price / 100).toFixed(0)}<span className="text-xs font-normal text-[#64748B]">/mo</span></span>
                    </div>

                    <div className="mt-4 border-t border-[#EEF3F9] pt-3">
                      {isCurrent ? (
                        <Button className="w-full" variant="outline" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-1.5 text-[#16A34A]" />
                          Current Plan
                        </Button>
                      ) : (
                        <CheckoutButton planId={plan.id} disabled={!isStripeConfigured} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
