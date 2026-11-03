import { Role, VerificationStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { mockAIAnalysis } from "@/lib/ai.service";
import { defaultCategories, plans } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export const DEMO_CUSTOMER_EMAIL = "customer@callauditx.com";
export const DEMO_CUSTOMER_PASSWORD = "Customer123!";
export const DEMO_ADMIN_EMAIL = "admin@callauditx.com";
export const DEMO_ADMIN_PASSWORD = "Admin123!";

const DEMO_PAYMENT_SESSION = "seed_demo_customer_starter";

const sampleCalls = [
  { title: "Inbound pricing inquiry", agentName: "Maya Chen", campaignName: "Spring Growth", callType: "Inbound", notes: "Prospect asked about analytics." },
  { title: "Billing complaint follow-up", agentName: "Owen Ross", campaignName: "Retention", callType: "Support", notes: "Customer needed billing correction." },
  { title: "Demo appointment booking", agentName: "Lina Patel", campaignName: "Demo Desk", callType: "Inbound", notes: "Booked Thursday slot." },
  { title: "Voicemail callback request", agentName: "No agent", campaignName: "Callback", callType: "Voicemail", notes: "Caller requested tomorrow afternoon." },
  { title: "Converted Pro account", agentName: "Maya Chen", campaignName: "Spring Growth", callType: "Sales", notes: "Customer accepted checkout." },
  { title: "Product feature questions", agentName: "Andre Cole", campaignName: "Expansion", callType: "Inbound", notes: "Asked about campaign analytics." }
];

export async function ensureDemoData() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({ where: { name: category.name }, update: category, create: category });
  }
  for (const plan of plans) {
    await prisma.plan.upsert({ where: { name: plan.name }, update: plan, create: plan });
  }
}

async function ensureSampleCalls(userId: string) {
  const categories = await prisma.category.findMany();
  for (let i = 0; i < sampleCalls.length; i++) {
    const sample = sampleCalls[i];
    const existing = await prisma.call.findFirst({ where: { userId, title: sample.title } });
    if (existing) continue;

    const call = await prisma.call.create({
      data: {
        userId,
        title: sample.title,
        audioUrl: "/sample-call.wav",
        fileName: `sample-call-${i + 1}.wav`,
        fileSize: 1200000 + i * 12000,
        duration: 180 + i * 22,
        agentName: sample.agentName,
        campaignName: sample.campaignName,
        callType: sample.callType,
        notes: sample.notes,
        status: "analyzed",
        createdAt: new Date(Date.now() - i * 86400000)
      }
    });
    const report = await mockAIAnalysis(categories, sample);
    await prisma.aIReport.create({
      data: {
        callId: call.id,
        transcript: report.transcript,
        transcriptSegments: report.transcriptSegments,
        summary: report.summary,
        categoryId: report.categoryId,
        categoryReason: report.categoryReason,
        sentiment: report.sentiment,
        customerIntent: report.customerIntent,
        agentScore: report.agentScore,
        leadQualityScore: report.leadQualityScore,
        callQualityScore: report.callQualityScore,
        confidenceScore: report.confidenceScore,
        keywords: report.keywords,
        mistakes: report.mistakes,
        recommendedAction: report.recommendedAction,
        customerMood: report.customerMood,
        callOutcome: report.callOutcome
      }
    });
    await prisma.reviewVerification.create({
      data: {
        callId: call.id,
        userId,
        status: i === 1 ? VerificationStatus.incorrect : i === 2 ? VerificationStatus.correct : VerificationStatus.pending,
        correctedCategoryId: i === 1 ? categories.find((category) => category.name === "Complaint")?.id : undefined,
        feedback: i === 1 ? "Customer tone was clearly a complaint, not a support request." : undefined
      }
    });
  }
}

export async function seedDemoAccounts(options?: { refreshPasswords?: boolean }) {
  await ensureDemoData();
  const starter = await prisma.plan.findUniqueOrThrow({ where: { name: "Starter" } });
  const pro = await prisma.plan.findUniqueOrThrow({ where: { name: "Pro" } });
  const adminHash = await hash(DEMO_ADMIN_PASSWORD, 12);
  const customerHash = await hash(DEMO_CUSTOMER_PASSWORD, 12);
  const refresh = options?.refreshPasswords
    ? {
        admin: { passwordHash: adminHash, role: Role.ADMIN, subscriptionStatus: "active", planId: pro.id, name: "CallAudit Admin" },
        customer: { passwordHash: customerHash, role: Role.CUSTOMER, subscriptionStatus: "active", planId: starter.id, name: "Demo Customer" }
      }
    : { admin: {}, customer: {} };

  const admin = await prisma.user.upsert({
    where: { email: DEMO_ADMIN_EMAIL },
    update: refresh.admin,
    create: {
      name: "CallAudit Admin",
      email: DEMO_ADMIN_EMAIL,
      passwordHash: adminHash,
      role: Role.ADMIN,
      subscriptionStatus: "active",
      planId: pro.id
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: DEMO_CUSTOMER_EMAIL },
    update: refresh.customer,
    create: {
      name: "Demo Customer",
      email: DEMO_CUSTOMER_EMAIL,
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      subscriptionStatus: "active",
      planId: starter.id
    }
  });

  await ensureSampleCalls(customer.id);

  const existingPayment = await prisma.payment.findUnique({ where: { stripeSessionId: DEMO_PAYMENT_SESSION } });
  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        userId: customer.id,
        amount: starter.price,
        currency: "usd",
        status: "paid",
        planName: starter.name,
        stripeSessionId: DEMO_PAYMENT_SESSION
      }
    });
  }

  return { admin, customer };
}

export async function getOrCreateDemoCustomer() {
  const { customer } = await seedDemoAccounts();
  return customer;
}

export async function ensureDemoLogin(email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  const isAdmin = normalized === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;
  const isCustomer = normalized === DEMO_CUSTOMER_EMAIL && password === DEMO_CUSTOMER_PASSWORD;
  if (!isAdmin && !isCustomer) return null;

  const seeded = await seedDemoAccounts();
  return isAdmin ? seeded.admin : seeded.customer;
}
