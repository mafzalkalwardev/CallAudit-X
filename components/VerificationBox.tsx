"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function VerificationBox({ callId, categories, status }: { callId: string; categories: { id: string; name: string }[]; status: string }) {
  const router = useRouter();
  const [incorrect, setIncorrect] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setMessage("");
    const verificationStatus = String(formData.get("status") || "correct");
    try {
      const response = await fetch(verificationStatus === "incorrect" ? `/api/calls/${callId}/correct` : `/api/calls/${callId}/verify`, { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error || "Unable to save verification");
        return;
      }
      setMessage("Review saved successfully.");
      router.refresh();
    } catch {
      setMessage("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-bold text-[#0F172A]">AI review verification</h3>
        <p className="mt-1.5 text-sm text-[#64748B]">
          Current status: <span className="font-semibold text-[#0F172A] capitalize">{status}</span>
        </p>
      </div>

      <form action={submit} className="space-y-3">
        <div className="flex flex-col gap-2">
          <Button name="status" value="correct" type="submit" variant="primary" disabled={busy} className="w-full">
            ✓ AI Review is Correct
          </Button>
          <button
            type="button"
            onClick={() => setIncorrect((val) => !val)}
            disabled={busy}
            className="w-full rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] px-4 py-3 text-sm font-semibold text-[#64748B] hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#2563EB] transition"
          >
            ✗ AI Review has Mistakes
          </button>
        </div>

        {incorrect ? (
          <div className="space-y-3 rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] p-4">
            <input type="hidden" name="status" value="incorrect" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                Correct Category
              </label>
              <select className="input" name="correctedCategoryId" required>
                <option value="">Select correct category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                Feedback (optional)
              </label>
              <textarea
                className="input min-h-24 resize-none"
                name="feedback"
                placeholder="What did the AI miss? Add details to improve model accuracy..."
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={busy}>
              {busy ? "Saving..." : "Submit correction"}
            </Button>
          </div>
        ) : null}
      </form>

      {message ? (
        <div className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-medium ${message.includes("successful") ? "border-[#16A34A]/25 bg-[#F0FDF4] text-[#15803D]" : "border-[#DC2626]/25 bg-[#FEF2F2] text-[#DC2626]"}`}>
          {message.includes("successful") ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {message}
        </div>
      ) : null}
    </Card>
  );
}
