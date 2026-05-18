import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const call = await prisma.call.findFirst({
    where: { id: params.id, ...(session.role === Role.ADMIN ? {} : { userId: session.id }) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      report: { include: { category: true } },
      verification: { include: { correctedCategory: true } }
    }
  });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      call: {
        id: call.id,
        title: call.title,
        fileName: call.fileName,
        fileSize: call.fileSize,
        audioUrl: call.audioUrl,
        agentName: call.agentName,
        campaignName: call.campaignName,
        callType: call.callType,
        notes: call.notes,
        status: call.status,
        createdAt: call.createdAt
      },
      customer: call.user,
      report: call.report,
      verification: call.verification
    },
    null,
    2
  );

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${call.title.replace(/[^a-z0-9_-]/gi, "_")}-audit-report.json"`
    }
  });
}
