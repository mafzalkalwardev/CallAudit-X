import Link from "next/link";
import { Card } from "@/components/ui";

export default function PaymentSuccessPage() {
  return <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4"><Card className="text-center"><h1 className="text-2xl font-semibold">Checkout is not connected yet</h1><p className="mt-2 text-slate-400">Stripe checkout will be connected in the backend phase. For now, choose a plan from pricing and continue to registration.</p><Link className="mt-6 inline-flex rounded-md bg-cyan-300 px-4 py-2 font-medium text-slate-950" href="/pricing">Back to pricing</Link></Card></main>;
}
