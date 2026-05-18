import Link from "next/link";
import { Card } from "@/components/ui";

export default function PaymentCancelPage() {
  return <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-lg place-items-center px-4"><Card className="text-center"><h1 className="text-2xl font-semibold">Payment cancelled</h1><p className="mt-2 text-slate-400">No changes were made to your plan.</p><Link className="mt-6 inline-flex rounded-md border border-white/10 px-4 py-2" href="/pricing">Return to pricing</Link></Card></main>;
}
