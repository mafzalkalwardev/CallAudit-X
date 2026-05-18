import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const verificationSchema = z.object({
  status: z.enum(["correct", "incorrect"]),
  correctedCategoryId: z.string().optional(),
  feedback: z.string().optional()
});
