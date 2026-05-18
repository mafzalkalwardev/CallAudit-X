import { Card } from "@/components/ui";

export default function ForgotPasswordPage() {
  return <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4"><Card className="w-full"><h1 className="text-2xl font-semibold">Forgot password</h1><p className="mt-2 text-sm text-slate-400">Password reset email UI placeholder for the MVP.</p><input className="input mt-6" type="email" placeholder="Email" /><button className="mt-4 w-full rounded-md bg-cyan-300 px-4 py-2 font-medium text-slate-950">Send reset link</button></Card></main>;
}
