import { NextResponse } from "next/server";
import { customerAnalytics } from "@/lib/analytics";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await customerAnalytics(session.id));
}
