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
  userStoryFormFields,
  userStoryFormSchema,
} from "@/api/backlog-us/schema";
import {
  useCreateUserStory,
  useEditUserStory,
} from "@/api/backlog-us/mutation";
import { z } from "zod";
import { UserStoryProps } from "@/api/backlog-us/type";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";

interface BacklogFormProps {
  onSuccess?: () => void;
  userStory?: UserStoryProps;
  mode: "create" | "edit";
}

export default function BacklogForm({
  onSuccess,
  userStory,
  mode,
}: BacklogFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [initialValuesSet, setInitialValuesSet] = useState(false);

  const { mutate: createUserStory, isPending: isCreating } =
    useCreateUserStory();
  const { mutate: editUserStory, isPending: isEditing } = useEditUserStory();
  const isPending = isCreating || isEditing;

  const form = useForm({
    resolver: zodResolver(userStoryFormSchema),
    defaultValues: {
      subject: "",
      project_id: "",
      version: "",
      tags: "",
      due_date: "",
    },
  });

  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }
  }, [project, form]);

  useEffect(() => {
    if (mode === "edit" && userStory && !initialValuesSet) {
      console.log("Setting edit form values:", userStory);

      form.setValue("subject", userStory.subject || "");

      if (userStory.project) {
        form.setValue("project_id", userStory.project.toString());
      }

      if (userStory.version !== undefined) {
        form.setValue("version", userStory.version.toString());
      }

      if (userStory.due_date) {
        form.setValue("due_date", userStory.due_date);
      }

      // Handle tags - convert array to comma-separated string
      if (userStory.tags && Array.isArray(userStory.tags)) {
        form.setValue("tags", userStory.tags.join(", "));
      }

      setInitialValuesSet(true);
    }
  }, [userStory, mode, form, initialValuesSet]);

  const onSubmit = (data: z.infer<typeof userStoryFormSchema>) => {
    // Parse tags from comma-separated string to array
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    if (mode === "create") {
      createUserStory(
        {
          project: parseInt(data.project_id),
          subject: data.subject,
        },
        {
          onSuccess: () => {
            form.reset({
              subject: "",
              project_id: project?.id?.toString() || "",
              version: "",
              tags: "",
              due_date: "",
            });

            if (onSuccess) {
              onSuccess();
            }
          },
        },
      );
    } else if (mode === "edit" && userStory?.id) {
      editUserStory(
        {
          id: userStory.id,
          project: parseInt(data.project_id),
          subject: data.subject,
          version: data.version ? parseInt(data.version) : undefined,
          tags: tagsArray,
          due_date: data.due_date || undefined,
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
  };

  const filteredFormFields = userStoryFormFields.filter((field) => {
    if (!field.required && field.name !== "project_id") {
      return mode === "edit";
    }
    return true;
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {filteredFormFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: fieldProps }) => (
              <FormItem className={field.hidden ? "hidden" : "flex flex-col"}>
                {!field.hidden && <FormLabel>{field.label}</FormLabel>}
                {field.type === "text" && (
                  <FormControl>
                    <Input
                      type={field.type}
                      required={field.required}
                      placeholder={
                        field.name === "tags"
                          ? "Enter tags separated by commas"
                          : `Enter ${field.label.toLowerCase()}`
                      }
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
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      {...fieldProps}
                      value={fieldProps.value || ""}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              {mode === "create"
                ? "Creating User Story..."
                : "Updating User Story..."}
            </>
          ) : mode === "create" ? (
            "Create User Story"
          ) : (
            "Update User Story"
          )}
        </Button>
      </form>
    </Form>
  );
}
