import { z } from "zod";
import { FormFieldDefinition } from "@/api/base/global-type";

const baseMembershipSchema = z.object({
  project_id: z.string(),
  role: z.string(),
});

export const membershipFormSchema = baseMembershipSchema.extend({
  username: z.string(),
});

export type MembershipFormSchema = typeof membershipFormSchema;

export const membershipFormFields: FormFieldDefinition<
  typeof membershipFormSchema
>[] = [
  {
    name: "username",
    label: "Username or Email",
    type: "text",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    hidden: false,
  },
  {
    name: "project_id",
    label: "Project ID",
    type: "text",
    required: true,
    hidden: true,
  },
  {
    name: "role",
    label: "Role",
    type: "text",
    required: true,
    hidden: true,
  },
];
