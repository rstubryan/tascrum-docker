"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  membershipFormSchema,
  membershipFormFields,
} from "@/api/membership/schema";
import { useCreateMembership } from "@/api/membership/mutation";
import { z } from "zod";
import { MembershipProps } from "@/api/membership/type";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetAllRoles } from "@/api/role/queries";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleProps } from "@/api/role/type";

interface MembershipFormProps {
  onSuccess?: () => void;
  membership?: MembershipProps;
  mode: "create" | "edit";
}

// Function to map roles to select options
function getRoleOptions(
  projectRoles: RoleProps[],
): { value: string; label: string }[] {
  return projectRoles.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  }));
}

export default function MembershipForm({
  onSuccess,
  membership,
  mode,
}: MembershipFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const { data: roles } = useGetAllRoles();
  const { mutate: createMembership, isPending } = useCreateMembership();

  // Get all roles for the current project
  const projectRoles =
    project && roles
      ? roles?.filter((role: RoleProps) => role.project === project.id)
      : [];
  const roleOptions = getRoleOptions(projectRoles);

  const form = useForm({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      username: "",
      project_id: project?.id?.toString() || "",
      role: membership?.role?.toString() || (roleOptions[0]?.value ?? ""), // Default to first role
    },
    mode: "onSubmit",
  });

  // Update form values when project changes
  React.useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }
    // Update default role if project changes
    if (roleOptions.length > 0) {
      form.setValue("role", roleOptions[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, roles]);

  const onSubmit = form.handleSubmit((data) => {
    if (mode === "create") {
      createMembership(
        {
          project: parseInt(data.project_id),
          role: parseInt(data.role),
          username: data.username,
        },
        {
          onSuccess: () => {
            if (onSuccess) {
              onSuccess();
            }
          },
        },
      );
    }
  });

  type FieldName = keyof z.infer<typeof membershipFormSchema>;

  // Deduplicate fields by name to prevent React key conflicts
  const uniqueFields = membershipFormFields.reduce(
    (acc, field, index) => {
      // If this field name already exists in our accumulator, skip it
      if (!acc.some((f) => f.name === field.name)) {
        acc.push({ ...field, uniqueKey: `${field.name}-${index}` });
      }
      return acc;
    },
    [] as ((typeof membershipFormFields)[0] & { uniqueKey: string })[],
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {uniqueFields.map((field) => {
          if (field.name === "role" && !field.hidden) {
            return (
              <FormField
                key={field.uniqueKey}
                control={form.control}
                name={field.name as FieldName}
                render={({ field: fieldProps }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Select
                        value={fieldProps.value}
                        onValueChange={fieldProps.onChange}
                        defaultValue={fieldProps.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
          return (
            <FormField
              key={field.uniqueKey}
              control={form.control}
              name={field.name as FieldName}
              render={({ field: fieldProps }) => (
                <FormItem className={field.hidden ? "hidden" : "flex flex-col"}>
                  {!field.hidden && <FormLabel>{field.label}</FormLabel>}
                  <FormControl>
                    <Input
                      type={field.type}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      {...fieldProps}
                      value={fieldProps.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              {mode === "edit" ? "Updating Member..." : "Adding Member..."}
            </>
          ) : mode === "edit" ? (
            "Update Member"
          ) : (
            "Add Member"
          )}
        </Button>
      </form>
    </Form>
  );
}
