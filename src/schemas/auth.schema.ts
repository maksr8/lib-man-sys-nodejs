import * as z from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const requestPasswordResetSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(64, "New password cannot exceed 64 characters"),
  token: z.string().min(1, "Reset token is required"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type RequestPasswordResetDto = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
