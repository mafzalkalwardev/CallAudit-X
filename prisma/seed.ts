import { PrismaClient, Role, VerificationStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultCategories, plans } from "../lib/categories";
import { mockAIAnalysis } from "../lib/ai.service";

const prisma = new PrismaClient();

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({ where: { name: category.name }, update: category, create: category });
  }
  for (const plan of plans) {
    await prisma.plan.upsert({ where: { name: plan.name }, update: plan, create: plan });
  }

  const starter = await prisma.plan.findUniqueOrThrow({ where: { name: "Starter" } });
  const pro = await prisma.plan.findUniqueOrThrow({ where: { name: "Pro" } });

  const admin = await prisma.user.upsert({
    where: { email: "admin@callauditx.com" },
    update: {},
    create: {
      name: "CallAudit Admin",
      email: "admin@callauditx.com",
      passwordHash: await hash("Admin123!", 12),
      role: Role.ADMIN,
      subscriptionStatus: "active",
      planId: pro.id
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@callauditx.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@callauditx.com",
      passwordHash: await hash("Customer123!", 12),
      role: Role.CUSTOMER,
      subscriptionStatus: "active",
      planId: starter.id
    }
  });

  const categories = await prisma.category.findMany();
  const samples = [
    { title: "Inbound pricing inquiry", agentName: "Maya Chen", campaignName: "Spring Growth", callType: "Inbound", notes: "Prospect asked about analytics." },
    { title: "Billing complaint follow-up", agentName: "Owen Ross", campaignName: "Retention", callType: "Support", notes: "Customer needed billing correction." },
    { title: "Demo appointment booking", agentName: "Lina Patel", campaignName: "Demo Desk", callType: "Inbound", notes: "Booked Thursday slot." },
    { title: "Voicemail callback request", agentName: "No agent", campaignName: "Callback", callType: "Voicemail", notes: "Caller requested tomorrow afternoon." },
    { title: "Converted Pro account", agentName: "Maya Chen", campaignName: "Spring Growth", callType: "Sales", notes: "Customer accepted checkout." },
    { title: "Product feature questions", agentName: "Andre Cole", campaignName: "Expansion", callType: "Inbound", notes: "Asked about campaign analytics." }
  ];

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const call = await prisma.call.create({
      data: {
        userId: customer.id,
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
    await prisma.aIReport.create({ data: { callId: call.id, ...report } });
    await prisma.reviewVerification.create({
      data: {
        callId: call.id,
        userId: customer.id,
        status: i === 1 ? VerificationStatus.incorrect : i === 2 ? VerificationStatus.correct : VerificationStatus.pending,
        correctedCategoryId: i === 1 ? categories.find((c) => c.name === "Complaint")?.id : undefined,
        feedback: i === 1 ? "Customer tone was clearly a complaint, not a support request." : undefined
      }
    });
  }

  await prisma.payment.create({
    data: { userId: customer.id, amount: starter.price, currency: "usd", status: "paid", planName: starter.name, stripeSessionId: `seed_${Date.now()}` }
  });

  console.log({ admin: admin.email, customer: customer.email, categories: categories.length });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
