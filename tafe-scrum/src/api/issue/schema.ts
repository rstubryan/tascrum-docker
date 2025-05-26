import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseIssueSchema = z.object({
  project_id: z.string(),
  assigned_to: z.string().optional(),
  assigned_users: z.array(z.string()).optional(),
  selectedMembers: z.array(z.string()).optional(),
});

export const issueFormSchema = baseIssueSchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
});

export const issueFormFields: FormFieldDefinition<typeof issueFormSchema>[] = [
  { name: "subject", label: "Issue Name", type: "text", required: true },
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

export const issueDetailFormSchema = baseIssueSchema.extend({
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(50, { message: "Subject must be at most 50 characters long" }),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

export const issueDetailFormFields: FormFieldDefinition<
  typeof issueDetailFormSchema
>[] = [
  { name: "subject", label: "Issue Name", type: "text", required: true },
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
  { name: "due_date", label: "Due Date", type: "date", required: false },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
  },
];
