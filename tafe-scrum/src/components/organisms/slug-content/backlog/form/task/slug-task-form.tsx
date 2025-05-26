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
  taskFormFields,
  taskDetailFormSchema,
  taskFormSchema,
  taskDetailFormFields,
} from "@/api/task/schema";
import { useCreateTask, useEditTask } from "@/api/task/mutation";
import { z } from "zod";
import { CreateTaskProps, TaskProps, UpdateTaskProps } from "@/api/task/type";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { MultiSelect } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";

interface SlugTaskFormProps {
  onSuccess?: () => void;
  task?: TaskProps;
  mode: "create" | "edit";
  userStoryId: string;
}

export default function SlugTaskForm({
  onSuccess,
  task,
  mode,
  userStoryId,
}: SlugTaskFormProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: editTask, isPending: isEditing } = useEditTask();
  const isPending = isCreating || isEditing;

  // Check if we're on the task detail page
  const isTaskDetailPage =
    pathname.includes("/tasks/") && !pathname.includes("/backlogs/");

  // Use the appropriate schema based on the page
  const formSchema = isTaskDetailPage ? taskDetailFormSchema : taskFormSchema;
  const formFields = isTaskDetailPage ? taskDetailFormFields : taskFormFields;

  // Define the form with both sets of fields to avoid TypeScript errors
  const form = useForm<z.infer<typeof taskDetailFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: task?.subject || "",
      project_id: project?.id?.toString() || "",
      user_story_id: userStoryId,
      version: task?.version?.toString() || "",
      assigned_to: task?.assigned_to?.toString() || "",
      assigned_users: task?.assigned_users?.map(String) || [],
      selectedMembers: [] as string[],
      due_date: task?.due_date || "",
      description: task?.description || "",
    },
    mode: "onSubmit",
  });

  // Update form values when project or task changes
  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }

    if (userStoryId) {
      form.setValue("user_story_id", userStoryId);
    }

    if (task) {
      if (task.subject !== undefined) {
        form.setValue("subject", task.subject || "");
      }

      if (task.version !== undefined) {
        form.setValue("version", task.version.toString());
      }

      // Always set these values regardless of page type - TypeScript will be happy
      // and the values will only be used when appropriate
      if (task.due_date !== undefined) {
        form.setValue("due_date", task.due_date || "");
      }

      if (task.description !== undefined) {
        form.setValue("description", task.description || "");
      }

      // Initialize selected members from both assigned_to and assigned_users
      const membersToSelect: string[] = [];

      if (task.assigned_to) {
        membersToSelect.push(task.assigned_to.toString());
      }

      if (task.assigned_users && task.assigned_users.length > 0) {
        task.assigned_users.forEach((id) => {
          const userId = id.toString();
          if (!membersToSelect.includes(userId)) {
            membersToSelect.push(userId);
          }
        });
      }

      setSelectedMembers(membersToSelect);
      form.setValue("selectedMembers", membersToSelect);
    }
  }, [project, task, userStoryId, form]);

  // Handle member selection changes
  const handleMemberSelection = (values: string[]) => {
    setSelectedMembers(values);
    form.setValue("selectedMembers", values, { shouldValidate: true });
  };

  // In the onSubmit function, modify the creation/edit task calls

  const onSubmit = form.handleSubmit((data) => {
    // Determine assigned_to and assigned_users based on selected members
    const assigned_to =
      selectedMembers.length > 0 ? parseInt(selectedMembers[0]) : null;

    const assigned_users =
      selectedMembers.length > 1
        ? selectedMembers.map((id) => parseInt(id))
        : selectedMembers.length === 1
          ? [parseInt(selectedMembers[0])]
          : [];

    if (mode === "create") {
      // Create a properly typed object based on page type
      const taskData: CreateTaskProps = {
        subject: data.subject,
        project: parseInt(data.project_id),
        user_story: parseInt(data.user_story_id),
        assigned_to,
        assigned_users,
      };

      // Only add these fields when on detail page and they exist in data
      if (isTaskDetailPage) {
        if ("due_date" in data) taskData.due_date = data.due_date || undefined;
        if ("description" in data)
          taskData.description = data.description || undefined;
      }

      createTask(taskData, {
        onSuccess: () => {
          // Create properly typed reset data
          const resetValues: Partial<z.infer<typeof taskDetailFormSchema>> = {
            subject: "",
            project_id: project?.id?.toString() || "",
            user_story_id: userStoryId,
            version: "",
            selectedMembers: [],
          };

          // Only include these fields when on detail page
          if (isTaskDetailPage) {
            resetValues.due_date = "";
            resetValues.description = "";
          }

          form.reset(resetValues);
          setSelectedMembers([]);

          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } else if (mode === "edit" && task?.id) {
      // Create a properly typed object for edit
      const taskData: UpdateTaskProps = {
        id: task.id,
        subject: data.subject,
        project: parseInt(data.project_id),
        user_story: parseInt(data.user_story_id),
        version: data.version ? parseInt(data.version) : undefined,
        assigned_to,
        assigned_users,
      };

      // Only add these fields when on detail page and they exist in data
      if (isTaskDetailPage) {
        if ("due_date" in data) taskData.due_date = data.due_date || undefined;
        if ("description" in data)
          taskData.description = data.description || undefined;
      }

      editTask(taskData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    }
  });
  // Filter fields based on mode and page
  const filteredFormFields = formFields.filter((field) => {
    // Hide these fields as they're handled automatically
    if (field.hidden) return false;

    // Show version only in edit mode
    if (field.name === "version") return mode === "edit";

    // Show due_date and description only on task detail page
    if (
      (field.name === "due_date" || field.name === "description") &&
      !isTaskDetailPage
    ) {
      return false;
    }

    // Hide the assigned_to and assigned_users fields as we'll handle them separately
    if (field.name === "assigned_to" || field.name === "assigned_users") {
      return false;
    }

    return true;
  });

  // Make sure to include 'subject' in filteredFormFields if it's not there
  if (!filteredFormFields.some((field) => field.name === "subject")) {
    filteredFormFields.unshift({
      name: "subject",
      label: "Task Name",
      type: "text",
      required: true,
    });
  }

  // Define all possible field names to avoid TypeScript errors
  type FieldName = keyof z.infer<typeof taskDetailFormSchema>;

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
                      required={field.required}
                      {...fieldProps}
                      value={fieldProps.value || ""}
                      className="min-h-32"
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
              {mode === "create" ? "Creating Task..." : "Updating Task..."}
            </>
          ) : mode === "create" ? (
            "Create Task"
          ) : (
            "Update Task"
          )}
        </Button>
      </form>
    </Form>
  );
}
