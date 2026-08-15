import { z } from "zod";

const indianPhoneRegex = /^(?:\+91[1-9]\d{9}|[6-9]\d{9})$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, { message: "validation.nameMin" }),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, { message: "validation.phoneInvalid" }),
  email: z
    .string()
    .trim()
    .email({ message: "validation.emailInvalid" })
    .optional()
    .or(z.literal("")),
  serviceId: z.string().optional(),
  message: z.string().trim().optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
