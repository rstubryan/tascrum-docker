import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseEpicSchema = z.object({
  project_id: z.string(),
  assigned_to: z.string().optional(),
  assigned_users: z.array(z.string()).optional(),
  selectedMembers: z.array(z.string()).optional(),
});

export const epicFormSchema = baseEpicSchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
});

export const epicDetailFormSchema = baseEpicSchema.extend({
  description: z.string().optional(),
});

export const epicDetailRelatedUsFormSchema = z.object({
  epic_id: z.string(),
  user_story_id: z.string(),
});

export const epicFormFields: FormFieldDefinition<typeof epicFormSchema>[] = [
  { name: "subject", label: "Epic Name", type: "text", required: true },
  {
    name: "assigned_to",
    label: "Assigned To",
    type: "select",
    required: false,
  },
  {
    name: "assigned_users",
    label: "Assigned Users",
    type: "multi-select",
    required: false,
  },
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
];

export const epicDetailFormFields: FormFieldDefinition<
  typeof epicDetailFormSchema
>[] = [
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
  },
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
];

export const epicDetailRelatedUsFormFields: FormFieldDefinition<
  typeof epicDetailRelatedUsFormSchema
>[] = [
  {
    name: "epic_id",
    label: "Epic ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "user_story_id",
    label: "User Story ID",
    type: "select",
    required: true,
  },
];
