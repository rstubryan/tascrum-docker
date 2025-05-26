import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

export const projectFormSchema = z.object({
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(50, { message: "Description must be at most 50 characters long" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  is_private: z.boolean().optional().default(false),
  is_epics_activated: z.boolean().optional().default(true),
});

export const projectFormFields: FormFieldDefinition<
  typeof projectFormSchema
>[] = [
  { name: "name", label: "Project Name", type: "text", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    name: "is_private",
    label: "Private Project",
    type: "checkbox",
    required: false,
  },
  {
    name: "is_epics_activated",
    label: "Enable Epics",
    type: "hidden",
    hidden: true,
  },
];
