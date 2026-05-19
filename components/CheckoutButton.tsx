"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CheckoutButton({ planId, disabled = false }: { planId: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    if (disabled) {
      setError("Stripe checkout is not configured yet.");
      return;
    }
    setLoading(true);
    setError("");
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Checkout is unavailable");
      return;
    }
    window.location.href = data.url;
  }
  return (
    <div className="space-y-2">
      <Button onClick={checkout} disabled={loading || disabled} className="w-full">{loading ? "Opening..." : "Choose plan"}</Button>
      {disabled ? <p className="text-xs leading-5 text-[#B45309]">Stripe checkout is not configured yet.</p> : null}
      {error ? <p className="text-xs leading-5 text-[#B45309]">{error}</p> : null}
    </div>
  );
}
