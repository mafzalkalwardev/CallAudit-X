import Link from "next/link";
import { Card } from "@/components/ui";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-lg place-items-center bg-[#F5F7FB] px-4">
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-[#0F172A]">Payment cancelled</h1>
        <p className="mt-2 text-sm text-[#64748B]">No changes were made to your plan.</p>
        <Link className="mt-6 inline-flex rounded-xl border border-[#D8E1EE] bg-white px-4 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF]" href="/pricing">
          Return to pricing
        </Link>
      </Card>
    </main>
  );
}
