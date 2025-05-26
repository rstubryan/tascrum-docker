import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseUserStorySchema = z.object({
  project_id: z.string(),
  version: z.string().optional(),
});

export const userStoryFormSchema = baseUserStorySchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
  tags: z.string().optional(),
  due_date: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      { message: "Invalid date format" },
    ),
});

export const userStoryFormFields: FormFieldDefinition<
  typeof userStoryFormSchema
>[] = [
  { name: "subject", label: "User Story Name", type: "text", required: true },
  { name: "tags", label: "Tags", type: "text", required: false },
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "version",
    label: "Version",
    type: "text",
    required: false,
    hidden: true,
  },
  {
    name: "due_date",
    label: "Due Date",
    type: "date",
    required: false,
  },
];

export const userStoryDetailFormSchema = baseUserStorySchema.extend({
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  assigned_users: z.array(z.string()).optional(),
});

export const userStoryDetailFormFields: FormFieldDefinition<
  typeof userStoryDetailFormSchema
>[] = [
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "version",
    label: "Version",
    type: "text",
    required: false,
    hidden: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
  },
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
];
