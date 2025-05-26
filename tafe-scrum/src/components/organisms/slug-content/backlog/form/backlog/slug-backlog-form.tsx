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
import { Textarea } from "@/components/ui/textarea";
import {
  userStoryDetailFormSchema,
  userStoryDetailFormFields,
} from "@/api/backlog-us/schema";
import { useEditUserStory } from "@/api/backlog-us/mutation";
import { z } from "zod";
import { UserStoryProps } from "@/api/backlog-us/type";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { MultiSelect } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";

interface SlugBacklogFormProps {
  onSuccess?: () => void;
  userStory?: UserStoryProps;
  mode: "create" | "edit";
}

export default function SlugBacklogForm({
  onSuccess,
  userStory,
  mode,
}: SlugBacklogFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { mutate: editUserStory, isPending } = useEditUserStory();

  // Create extended schema that includes selectedMembers
  const formSchemaWithMembers = userStoryDetailFormSchema.extend({
    selectedMembers: z.array(z.string()).optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchemaWithMembers),
    defaultValues: {
      description: userStory?.description || "",
      project_id: project?.id?.toString() || "",
      version: userStory?.version?.toString() || "",
      assigned_to: userStory?.assigned_to?.toString() || "",
      assigned_users: userStory?.assigned_users?.map(String) || [],
      selectedMembers: [] as string[],
    },
    mode: "onSubmit",
  });

  // Update form values when project or userStory changes
  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }

    if (userStory) {
      if (userStory.description !== undefined) {
        form.setValue("description", userStory.description || "");
      }

      if (userStory.version !== undefined) {
        form.setValue("version", userStory.version.toString());
      }

      // Initialize selected members from both assigned_to and assigned_users
      const membersToSelect: string[] = [];

      if (userStory.assigned_to) {
        membersToSelect.push(userStory.assigned_to.toString());
      }

      if (userStory.assigned_users && userStory.assigned_users.length > 0) {
        userStory.assigned_users.forEach((id) => {
          const userId = id.toString();
          if (!membersToSelect.includes(userId)) {
            membersToSelect.push(userId);
          }
        });
      }

      setSelectedMembers(membersToSelect);
      form.setValue("selectedMembers", membersToSelect);
    }
  }, [project, userStory, form]);

  // Handle member selection changes
  const handleMemberSelection = (values: string[]) => {
    setSelectedMembers(values);
    form.setValue("selectedMembers", values, { shouldValidate: true });
  };

  const onSubmit = form.handleSubmit((data) => {
    if (mode === "edit" && userStory?.id) {
      // Determine assigned_to and assigned_users based on selected members
      const assigned_to =
        selectedMembers.length > 0 ? parseInt(selectedMembers[0]) : null;

      const assigned_users =
        selectedMembers.length > 1
          ? selectedMembers.map((id) => parseInt(id))
          : selectedMembers.length === 1
            ? [parseInt(selectedMembers[0])]
            : [];

      editUserStory(
        {
          id: userStory.id,
          subject: userStory.subject || "",
          project: parseInt(data.project_id),
          description: data.description || undefined,
          assigned_to,
          assigned_users,
          version: data.version ? parseInt(data.version) : undefined,
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

  // Filter fields based on mode
  const filteredFormFields = userStoryDetailFormFields.filter((field) => {
    // Hide these fields as they're handled automatically
    if (field.hidden) return false;

    // Show version only in edit mode
    if (field.name === "version") return mode === "edit";

    // Hide the assigned_to and assigned_users fields as we'll handle them separately
    if (field.name === "assigned_to" || field.name === "assigned_users")
      return false;

    return true;
  });

  // Fix for TypeScript error - create a proper type for field names
  type FieldName = keyof z.infer<typeof userStoryDetailFormSchema>;

  // Prepare member options for the MultiSelect component
  const memberOptions =
    project?.members?.map((member) => ({
      label: member.full_name_display || member.username,
      value: member.id.toString(),
    })) || [];

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {filteredFormFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as FieldName}
            render={({ field: fieldProps }) => (
              <FormItem className={field.hidden ? "hidden" : "flex flex-col"}>
                {!field.hidden && <FormLabel>{field.label}</FormLabel>}
                {field.type === "text" && (
                  <FormControl>
                    <Input
                      type={field.type}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      {...fieldProps}
                      value={fieldProps.value || ""}
                      readOnly={field.name === "version"}
                    />
                  </FormControl>
                )}
                {field.type === "textarea" && (
                  <FormControl>
                    <Textarea
                      required={field.required}
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
        ))}

        {/* Render custom assignment field with MultiSelect */}
        <FormItem className="flex flex-col">
          <FormLabel>Assign Members</FormLabel>
          <FormControl>
            <MultiSelect
              options={memberOptions}
              onValueChange={handleMemberSelection}
              defaultValue={selectedMembers}
              placeholder="Select members to assign"
              className={cn("w-full")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              {mode === "edit"
                ? "Updating User Story..."
                : "Creating User Story..."}
            </>
          ) : mode === "edit" ? (
            "Update User Story"
          ) : (
            "Create User Story"
          )}
        </Button>
      </form>
    </Form>
  );
}
