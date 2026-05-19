import { NextResponse } from "next/server";
import { customerAnalytics } from "@/lib/analytics";
import { getSession } from "@/lib/auth";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";

export async function GET() {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  return NextResponse.json(await customerAnalytics(session?.id || demoUser!.id));
}
