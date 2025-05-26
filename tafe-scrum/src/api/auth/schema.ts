import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
  type: z.string().default("normal"),
});

export const loginFormFields: FormFieldDefinition<typeof loginFormSchema>[] = [
  { name: "username", label: "Username", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "type", label: "Type", type: "hidden", hidden: true },
];

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50, { message: "Full name must be at most 50 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
  type: z.string().default("public"),
  accepted_terms: z.string().default("true"),
});

export const registerFormFields: FormFieldDefinition<
  typeof registerFormSchema
>[] = [
  { name: "username", label: "Username", type: "text", required: true },
  { name: "full_name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "type", label: "Type", type: "hidden", hidden: true },
  {
    name: "accepted_terms",
    label: "Accepted Terms",
    type: "hidden",
    hidden: true,
  },
];
