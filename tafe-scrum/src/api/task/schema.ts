import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseTaskSchema = z.object({
  project_id: z.string(),
  user_story_id: z.string(),
  version: z.string().optional(),
  assigned_to: z.string().optional(),
  assigned_users: z.array(z.string()).optional(),
  selectedMembers: z.array(z.string()).optional(),
});

export const taskFormSchema = baseTaskSchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
});

baseTaskSchema.extend({
  status: z.enum([
    "new",
    "in_progress",
    "ready_for_test",
    "closed",
    "needs_info",
  ]),
  message: z.string(),
});

export const taskDetailFormSchema = baseTaskSchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

export const taskFormFields: FormFieldDefinition<typeof taskFormSchema>[] = [
  { name: "subject", label: "Task Name", type: "text", required: true },
  {
    name: "assigned_to",
    label: "Assigned To",
    type: "select",
    required: false,
  },
  {
    name: "assigned_users",
    label: "Assigned Users",
    type: "select",
    required: false,
    hidden: true,
  },
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "user_story_id",
    label: "User Story ID",
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
];

export const taskDetailFormFields: FormFieldDefinition<
  typeof taskDetailFormSchema
>[] = [
  {
    name: "due_date",
    label: "Due Date",
    type: "date",
    required: false,
  },
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
  {
    name: "user_story_id",
    label: "User Story ID",
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
    name: "assigned_to",
    label: "Assigned To",
    type: "select",
    required: false,
  },
  {
    name: "assigned_users",
    label: "Assigned Users",
    type: "select",
    required: false,
  },
];
