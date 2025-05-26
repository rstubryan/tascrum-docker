import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseSprintSchema = z.object({
  project_id: z.string(),
  version: z.string().optional(),
});

export const sprintFormSchema = baseSprintSchema.extend({
  name: z
    .string()
    .min(3, { message: "Sprint name must be at least 3 characters long" })
    .max(50, { message: "Sprint name must be at most 50 characters long" }),
  start_date: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      { message: "Invalid start date format" },
    ),
  end_date: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      { message: "Invalid end date format" },
    ),
});

export const sprintFormFields: FormFieldDefinition<typeof sprintFormSchema>[] =
  [
    { name: "name", label: "Sprint Name", type: "text", required: true },
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
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: false,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      required: false,
    },
  ];

export const sprintAssociatedUsFormSchema = baseSprintSchema.extend({
  project_id: z.string(),
  milestone_id: z.string(),
  bulk_userstories: z.array(z.number()),
});

export const sprintAssociatedUsFormFields: FormFieldDefinition<
  typeof sprintAssociatedUsFormSchema
>[] = [
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "milestone_id",
    label: "Milestone ID",
    type: "text",
    required: true,
  },
  {
    name: "bulk_userstories",
    label: "User Stories",
    type: "multi-select",
    required: true,
  },
];
