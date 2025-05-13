import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  institution: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
});
