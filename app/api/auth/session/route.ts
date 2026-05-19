import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({ authenticated: true, session });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
