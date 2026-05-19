import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set(["active", "inactive", "trialing", "past_due", "canceled"]);

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  planId: true,
  subscriptionStatus: true,
  createdAt: true,
  updatedAt: true,
  plan: true,
  _count: { select: { calls: true, payments: true } }
} as const;

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) return null;
  return session;
}

async function wouldRemoveLastAdmin(targetId: string, nextRole?: Role, nextStatus?: string, deleting = false) {
  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { role: true, subscriptionStatus: true } });
  if (!target || target.role !== Role.ADMIN) return false;

  const adminCount = await prisma.user.count({ where: { role: Role.ADMIN, subscriptionStatus: { not: "inactive" } } });
  const removingAdminAccess =
    deleting ||
    nextRole === Role.CUSTOMER ||
    nextStatus === "inactive" ||
    (target.subscriptionStatus !== "inactive" && adminCount <= 1 && nextStatus && nextStatus !== target.subscriptionStatus && nextStatus !== "active" && nextStatus !== "trialing");

  return adminCount <= 1 && removingAdminAccess;
}

function cleanEmail(email: unknown) {
  return String(email || "").toLowerCase().trim();
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: adminUserSelect,
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = cleanEmail(body.email);
    const password = String(body.password || "");
    const role = body.role === Role.ADMIN ? Role.ADMIN : Role.CUSTOMER;
    const subscriptionStatus = allowedStatuses.has(body.subscriptionStatus) ? body.subscriptionStatus : "active";
    const planId = body.planId ? String(body.planId) : null;

    if (!name || !email || password.length < 8) {
      return NextResponse.json({ error: "Name, email, and an 8+ character password are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email." }, { status: 409 });
    }

    if (planId) {
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) return NextResponse.json({ error: "Selected plan was not found." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role,
        planId,
        subscriptionStatus
      },
      select: adminUserSelect
    });

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "User id is required." }, { status: 400 });

    const current = await prisma.user.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const role = body.role === Role.ADMIN ? Role.ADMIN : Role.CUSTOMER;
    const subscriptionStatus = allowedStatuses.has(body.subscriptionStatus) ? body.subscriptionStatus : current.subscriptionStatus;
    const planId = body.planId === "" ? null : body.planId ? String(body.planId) : current.planId;

    if (id === session.id && (role !== Role.ADMIN || subscriptionStatus === "inactive")) {
      return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });
    }

    if (await wouldRemoveLastAdmin(id, role, subscriptionStatus)) {
      return NextResponse.json({ error: "Cannot remove access from the last active admin." }, { status: 400 });
    }

    if (planId) {
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) return NextResponse.json({ error: "Selected plan was not found." }, { status: 400 });
    }

    const data: any = {
      name: String(body.name || current.name).trim(),
      email: body.email ? cleanEmail(body.email) : current.email,
      role,
      planId,
      subscriptionStatus
    };

    const password = typeof body.password === "string" ? body.password : "";
    if (password) {
      if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      data.passwordHash = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: adminUserSelect
    });

    return NextResponse.json({ ok: true, user });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "User id is required." }, { status: 400 });
  if (id === session.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (await wouldRemoveLastAdmin(id, undefined, undefined, true)) {
    return NextResponse.json({ error: "Cannot delete the last active admin." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
