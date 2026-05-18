"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CheckoutButton({ planId }: { planId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
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
      <Button onClick={checkout} disabled={loading} className="w-full">{loading ? "Opening..." : "Choose plan"}</Button>
      {error ? <p className="text-xs leading-5 text-amber-200">{error}</p> : null}
    </div>
  );
}
