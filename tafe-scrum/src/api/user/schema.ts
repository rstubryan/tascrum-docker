import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

export const profileFormSchema = z.object({
  id: z.number().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  full_name: z.string().optional(),
  bio: z.string().optional(),
});

export type ProfileFormSchema = typeof profileFormSchema;

export const profileFormFields: FormFieldDefinition<
  typeof profileFormSchema
>[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    required: false,
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    required: false,
  },
  {
    name: "full_name",
    label: "Full Name",
    type: "text",
    required: false,
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    required: false,
  },
];

export const passwordFormSchema = z.object({
  current_password: z
    .string()
    .min(
      0,
      "Current password is required (or empty if you have no password yet)",
    ),
  password: z.string().min(8, "New password is required"),
  password_confirmation: z.string().min(8, "Confirm password is required"),
});

export type PasswordFormSchema = typeof passwordFormSchema;

export const passwordFormFields: FormFieldDefinition<
  typeof passwordFormSchema
>[] = [
  {
    name: "current_password",
    label: "Current Password",
    type: "password",
    required: true,
  },
  {
    name: "password",
    label: "New Password",
    type: "password",
    required: true,
  },
  {
    name: "password_confirmation",
    label: "Confirm New Password",
    type: "password",
    required: true,
  },
];

export const changeProfilePictureFormSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    }),
});

export type ChangeProfilePictureFormSchema =
  typeof changeProfilePictureFormSchema;

export const changeProfilePictureFormFields: FormFieldDefinition<
  typeof changeProfilePictureFormSchema
>[] = [
  {
    name: "photo",
    label: "Profile Picture",
    type: "file",
    required: true,
  },
];
