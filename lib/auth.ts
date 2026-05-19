import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const cookieName = "callaudit_token";

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  planId: true,
  stripeCustomerId: true,
  subscriptionStatus: true,
  createdAt: true,
  updatedAt: true,
  plan: true
} as const;

function secret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dev-secret-change-me");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: { id: string; email: string; role: Role; name: string }) {
  const token = await new SignJWT({ email: user.email, role: user.role, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession() {
  cookies().delete(cookieName);
}

export async function getSession() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, secret());
    return {
      id: verified.payload.sub!,
      email: String(verified.payload.email),
      role: verified.payload.role as Role,
      name: String(verified.payload.name)
    };
  } catch {
    return null;
  }
}

export async function requireUser(role?: Role) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if (role && session.role !== role) throw new Error("Forbidden");
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.id }, select: safeUserSelect });
}
