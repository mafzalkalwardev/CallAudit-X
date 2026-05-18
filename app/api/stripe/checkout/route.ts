import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId } = await request.json();
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  if (!process.env.STRIPE_SECRET_KEY || !plan.stripePriceId?.startsWith("price_")) {
    return NextResponse.json({ error: "Stripe test checkout is not configured. Add STRIPE_SECRET_KEY and real test Price IDs for plans." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/cancel`,
    customer_email: session.email,
    metadata: { userId: session.id, planId: plan.id, planName: plan.name }
  });
  await prisma.payment.create({ data: { userId: session.id, amount: plan.price, status: "pending", planName: plan.name, stripeSessionId: checkout.id } });
  return NextResponse.json({ url: checkout.url });
}
