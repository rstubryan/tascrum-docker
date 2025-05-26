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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  issueFormFields,
  issueFormSchema,
  issueDetailFormSchema,
  issueDetailFormFields,
} from "@/api/issue/schema";
import { useCreateIssue, useEditIssue } from "@/api/issue/mutation";
import { z } from "zod";
import { CreateIssueProps, EditIssueProps, IssueProps } from "@/api/issue/type";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { MultiSelect } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";

interface IssueFormProps {
  onSuccess?: () => void;
  issue?: IssueProps;
  mode: "create" | "edit";
}

export default function IssueForm({ onSuccess, issue, mode }: IssueFormProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [initialValuesSet, setInitialValuesSet] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Determine if we're on a detail page by checking if pathname contains an issue ID
  const isDetailView = pathname.match(/\/issues\/\d+$/);

  const { mutate: createIssue, isPending: isCreating } = useCreateIssue();
  const { mutate: editIssue, isPending: isEditing } = useEditIssue();
  const isPending = isCreating || isEditing;

  // Use the appropriate schema based on view type
  const formSchema = isDetailView ? issueDetailFormSchema : issueFormSchema;
  const formFields = isDetailView ? issueDetailFormFields : issueFormFields;

  // Define form with combined type to satisfy TypeScript
  const form = useForm<z.infer<typeof issueDetailFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      project_id: "",
      assigned_to: "",
      assigned_users: [],
      selectedMembers: [],
      description: "",
      due_date: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }
  }, [project, form]);

  useEffect(() => {
    if (mode === "edit" && issue && !initialValuesSet) {
      // Set common fields
      form.setValue("subject", issue.subject || "");

      if (issue.project) {
        form.setValue("project_id", issue.project.toString());
      }

      // Initialize selected members from assigned_to
      if (issue.assigned_to) {
        const membersToSelect = [issue.assigned_to.toString()];
        setSelectedMembers(membersToSelect);
        form.setValue("selectedMembers", membersToSelect);
        form.setValue("assigned_to", issue.assigned_to.toString());
      }

      // Set detail view specific fields
      if (isDetailView) {
        form.setValue("description", issue.description || "");
        form.setValue("due_date", issue.due_date || "");
      }

      setInitialValuesSet(true);
    }
  }, [issue, mode, form, initialValuesSet, isDetailView]);

  const handleMemberSelection = (values: string[]) => {
    setSelectedMembers(values);
    form.setValue("selectedMembers", values, { shouldValidate: true });

    // Also update assigned_to field when members change
    if (values.length > 0) {
      form.setValue("assigned_to", values[0], { shouldValidate: true });
    } else {
      form.setValue("assigned_to", "", { shouldValidate: true });
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Get assigned_to value directly from selectedMembers
    const assigned_to =
      selectedMembers.length > 0 ? parseInt(selectedMembers[0]) : null;

    if (mode === "create") {
      // Create a properly typed object
      const issueData: CreateIssueProps = {
        project: parseInt(data.project_id),
        subject: data.subject,
        assigned_to: assigned_to,
      };

      createIssue(issueData, {
        onSuccess: () => {
          // Define reset data with correct partial type
          const resetValues: Partial<z.infer<typeof issueDetailFormSchema>> = {
            subject: "",
            project_id: project?.id?.toString() || "",
            assigned_to: "",
            assigned_users: [],
            selectedMembers: [],
          };

          // Add detail fields to reset data if using detail form
          if (isDetailView) {
            resetValues.description = "";
            resetValues.due_date = "";
          }

          form.reset(resetValues);
          setSelectedMembers([]);

          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } else if (mode === "edit" && issue?.id) {
      // Create a properly typed edit object
      const editData: EditIssueProps = {
        id: issue.id,
        project: parseInt(data.project_id),
        subject: data.subject,
        version: issue.version,
        assigned_to: assigned_to,
      };

      // Add detail fields if using detail form
      if (isDetailView) {
        if ("description" in data && typeof data.description === "string") {
          editData.description = data.description;
        }

        if ("due_date" in data) {
          if (typeof data.due_date === "string") {
            editData.due_date = data.due_date;
          } else if (data.due_date === null) {
            editData.due_date = null;
          }
        }
      }

      editIssue(editData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    }
  };
  // Filter fields based on view type and hide fields handled separately
  const filteredFormFields = formFields.filter((field) => {
    // Skip fields we handle separately
    if (field.name === "assigned_to" || field.name === "assigned_users") {
      return false;
    }

    // Hide fields marked as hidden
    return !field.hidden;
  });

  // Prepare member options for the MultiSelect component
  const memberOptions =
    project?.members?.map((member) => ({
      label: member.full_name_display || member.username,
      value: member.id.toString(),
    })) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {filteredFormFields.map((field) => {
          // TypeScript helper for field names
          type FieldName = keyof z.infer<typeof issueDetailFormSchema>;

          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as FieldName}
              render={({ field: fieldProps }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{field.label}</FormLabel>
                  {field.type === "text" && (
                    <FormControl>
                      <Input
                        type="text"
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...fieldProps}
                        value={fieldProps.value || ""}
                      />
                    </FormControl>
                  )}
                  {field.type === "date" && (
                    <FormControl>
                      <Input
                        type="date"
                        required={field.required}
                        {...fieldProps}
                        value={fieldProps.value || ""}
                      />
                    </FormControl>
                  )}
                  {field.type === "textarea" && (
                    <FormControl>
                      <Textarea
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...fieldProps}
                        value={fieldProps.value || ""}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        {/* Assign Member field */}
        <FormItem className="flex flex-col">
          <FormLabel>Assign Member</FormLabel>
          <FormControl>
            <MultiSelect
              options={memberOptions}
              onValueChange={handleMemberSelection}
              defaultValue={selectedMembers}
              placeholder="Select a member to assign"
              className={cn("w-full")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              {mode === "create" ? "Creating Issue..." : "Updating Issue..."}
            </>
          ) : mode === "create" ? (
            "Create Issue"
          ) : (
            "Update Issue"
          )}
        </Button>
      </form>
    </Form>
  );
}
