"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error || "Authentication failed");
      return;
    }
    const data = await response.json();
    router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form action={submit} className="space-y-4">
      {mode === "register" ? <input className="input" name="name" placeholder="Full name" required /> : null}
      <input className="input" name="email" type="email" placeholder="Email" required />
      <input className="input" name="password" type="password" placeholder="Password" required />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button disabled={loading} className="w-full">{loading ? "Working..." : mode === "login" ? "Login" : "Create account"}</Button>
    </form>
  );
}
