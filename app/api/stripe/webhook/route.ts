import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, mode: "not_configured" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        
        if (userId && planId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              planId,
              subscriptionStatus: "active",
              stripeCustomerId: String(session.customer || "")
            }
          });
          
          if (session.id) {
            await prisma.payment.updateMany({
              where: { stripeSessionId: session.id },
              data: { status: "paid" }
            });
          }
          console.log(`Successfully activated subscription for User ID: ${userId} with Plan ID: ${planId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = String(subscription.customer);
        const stripePriceId = subscription.items.data[0]?.price.id;

        if (stripeCustomerId && stripePriceId) {
          // Find matching plan in database
          const plan = await prisma.plan.findFirst({
            where: { stripePriceId }
          });

          if (plan) {
            await prisma.user.updateMany({
              where: { stripeCustomerId },
              data: {
                planId: plan.id,
                subscriptionStatus: subscription.status === "active" ? "active" : "trialing"
              }
            });
            console.log(`Successfully updated subscription for Customer: ${stripeCustomerId} to Plan: ${plan.name}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = String(subscription.customer);

        if (stripeCustomerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId },
            data: {
              subscriptionStatus: "canceled"
            }
          });
          console.log(`Successfully canceled subscription for Customer: ${stripeCustomerId}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeCustomerId = String(invoice.customer);
        const amount = invoice.amount_paid;

        if (stripeCustomerId && amount > 0) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId }
          });

          if (user) {
            // Log successful invoice payment inside Payments table
            await prisma.payment.create({
              data: {
                userId: user.id,
                amount,
                status: "paid",
                planName: "Invoice renewal payment",
                stripeSessionId: invoice.id || null
              }
            });
            console.log(`Log payment succeeded invoice event for customer ${stripeCustomerId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled stripe webhook event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error("Error processing stripe webhook event:", err.message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
