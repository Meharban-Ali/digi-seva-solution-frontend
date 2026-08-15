import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "adminAuth.emailInvalid" }),
  password: z.string().min(1, { message: "adminAuth.passwordRequired" }),
});

export const otpSchema = z.object({
  otpCode: z
    .string()
    .trim()
    .length(6, { message: "adminAuth.otpLength" })
    .regex(/^\d{6}$/, { message: "adminAuth.otpDigitsOnly" }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "adminAuth.oldPasswordRequired" }),
    newPassword: z.string().min(8, { message: "adminAuth.newPasswordMin" }),
    confirmPassword: z.string().min(1, { message: "adminAuth.confirmPasswordRequired" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "adminAuth.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
