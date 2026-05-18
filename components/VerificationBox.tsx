"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";

export function VerificationBox({ callId, categories, status }: { callId: string; categories: { id: string; name: string }[]; status: string }) {
  const router = useRouter();
  const [incorrect, setIncorrect] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const response = await fetch(`/api/calls/${callId}/verify`, { method: "POST", body: formData });
    if (!response.ok) {
      setMessage((await response.json()).error || "Unable to save verification");
      return;
    }
    setMessage("Review saved.");
    router.refresh();
  }

  return (
    <Card>
      <h3 className="font-semibold">AI review verification</h3>
      <p className="mt-2 text-sm text-slate-400">Current status: {status}</p>
      <form action={submit} className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <Button name="status" value="correct" type="submit">Mark AI Review Correct</Button>
          <button type="button" onClick={() => setIncorrect(true)} className="rounded-md border border-rose-300/30 px-4 py-2 text-rose-100 hover:bg-rose-300/10">Mark AI Review Incorrect</button>
        </div>
        {incorrect ? (
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <input type="hidden" name="status" value="incorrect" />
            <select className="input" name="correctedCategoryId" required>
              <option value="">Select correct category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <textarea className="input min-h-24" name="feedback" placeholder="What did the AI miss?" />
            <Button type="submit">Submit correction</Button>
          </div>
        ) : null}
      </form>
      {message ? <p className="mt-3 text-sm text-cyan-200">{message}</p> : null}
    </Card>
  );
}
