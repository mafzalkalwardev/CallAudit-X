"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, MailCheck, AlertCircle, Copy, Check } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard } from "@/components/public/MarketingComponents";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    setResetUrl("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate password reset");
      }

      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AuthLayout 
      title="Reset your CallAudit X workspace password" 
      subtitle="Enter your email to retrieve access credentials. In development mode, the reset link is displayed directly on the screen."
    >
      <div className="w-full max-w-md">
        <GlassCard className="p-6" glow>
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition mb-4">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Forgot password?</h1>
            <p className="mt-1.5 text-sm text-[#64748B]">No worries, we&apos;ll help you recover your access credentials.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-4 text-sm text-[#DC2626] font-semibold mb-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4">
                <MailCheck className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#15803D]">Request Processed</p>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                    If an account exists with that email, a secure password recovery link has been generated.
                  </p>
                </div>
              </div>

              {resetUrl && (
                <div className="rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2.5">Development Environment Action</p>
                  <p className="text-xs text-[#334155] leading-relaxed mb-3 bg-white p-2 rounded-lg border border-[#D8E1EE] break-all font-mono">
                    {resetUrl}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={resetUrl}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-[#1D4ED8] transition"
                    >
                      Reset Password Now
                    </a>
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#D8E1EE] bg-white px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#EEF3F9] transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5 text-[#64748B]" />}
                      {copied ? "Copied" : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Work email address</span>
                <input 
                  className="input bg-white border border-[#D8E1EE]" 
                  type="email" 
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white transition hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating recovery token...
                  </>
                ) : (
                  "Generate Recovery Link"
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
