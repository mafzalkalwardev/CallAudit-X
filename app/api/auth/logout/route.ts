import { redirect } from "next/navigation";
import { clearSession } from "@/lib/auth";

export async function POST() {
  clearSession();
  redirect("/");
}
