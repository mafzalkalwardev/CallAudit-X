"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/public/AuthLayout";
import { GlassCard } from "@/components/public/MarketingComponents";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing from URL query parameters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <GlassCard className="p-6" glow>
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition mb-4">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Reset password</h1>
          <p className="mt-1.5 text-sm text-[#64748B]">Choose a secure password with at least 6 characters.</p>
        </div>

        {!token && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-4 text-sm text-[#DC2626] font-semibold mb-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
            <span>Reset token is missing. Please initiate a new password recovery request.</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-4 text-sm text-[#DC2626] font-semibold mb-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex items-start gap-3 rounded-xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4">
            <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#15803D]">Password Reset Successful</p>
              <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                Your password has been updated in the database. Redirecting you to login...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">New Password</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                type="password" 
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">Confirm New Password</span>
              <input 
                className="input bg-white border border-[#D8E1EE]" 
                type="password" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading || !token}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 font-bold text-white transition hover:bg-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Create your new CallAudit X password" 
      subtitle="Complete your password reset by selecting a new, secure password for your workspace."
    >
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
          <p className="text-sm font-semibold text-[#64748B] mt-3">Loading reset session...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
