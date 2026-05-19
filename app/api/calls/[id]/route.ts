import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const demoUser = session ? null : await getOrCreateDemoCustomer();
    const call = await prisma.call.findFirst({
      where: { id: params.id, ...(session?.role === Role.ADMIN ? {} : { userId: session?.id || demoUser!.id }) },
      include: { report: { include: { category: true } }, verification: { include: { correctedCategory: true } } }
    });
    if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(call);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load call" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const demoUser = session ? null : await getOrCreateDemoCustomer();
    const call = await prisma.call.findFirst({ where: { id: params.id, ...(session?.role === Role.ADMIN ? {} : { userId: session?.id || demoUser!.id }) } });
    if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.call.delete({ where: { id: call.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete call" }, { status: 500 });
  }
}
