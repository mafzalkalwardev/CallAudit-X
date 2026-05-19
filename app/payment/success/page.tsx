import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4 bg-[#F5F7FB]">
      <div className="w-full rounded-2xl border border-[#D8E1EE] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#BBF7D0] bg-[#F0FDF4]">
          <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#0F172A]">Stripe Checkout</h1>
        <p className="mt-3 text-[#64748B]">
          Stripe checkout is not fully connected yet. In production, this page verifies your session and activates your subscription. Choose a plan from pricing and continue to registration.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-2.5 font-bold text-white hover:bg-[#1D4ED8] transition" href="/dashboard">
            Go to Dashboard
          </Link>
          <Link className="inline-flex items-center justify-center rounded-xl border border-[#D8E1EE] bg-white px-5 py-2.5 font-semibold text-[#64748B] hover:bg-[#F5F7FB] transition" href="/pricing">
            View Pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
