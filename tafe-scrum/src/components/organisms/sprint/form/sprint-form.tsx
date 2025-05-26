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
import { sprintFormFields, sprintFormSchema } from "@/api/sprint/schema";
import { useCreateSprint, useEditSprint } from "@/api/sprint/mutation";
import { z } from "zod";
import { SprintProps } from "@/api/sprint/type";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";

interface SprintFormProps {
  onSuccess?: () => void;
  sprint?: SprintProps;
  mode: "create" | "edit";
}

export default function SprintForm({
  onSuccess,
  sprint,
  mode,
}: SprintFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [initialValuesSet, setInitialValuesSet] = useState(false);

  const { mutate: createSprint, isPending: isCreating } = useCreateSprint();
  const { mutate: editSprint, isPending: isEditing } = useEditSprint();
  const isPending = isCreating || isEditing;

  const form = useForm({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: {
      name: "",
      project_id: "",
      version: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }
  }, [project, form]);

  useEffect(() => {
    if (mode === "edit" && sprint && !initialValuesSet) {
      form.setValue("name", sprint.name || "");

      if (sprint.project) {
        form.setValue("project_id", sprint.project.toString());
      }

      if (sprint.version !== undefined) {
        form.setValue("version", sprint.version.toString());
      }

      if (sprint.estimated_start) {
        form.setValue("start_date", sprint.estimated_start);
      }

      if (sprint.estimated_finish) {
        form.setValue("end_date", sprint.estimated_finish);
      }

      setInitialValuesSet(true);
    }
  }, [sprint, mode, form, initialValuesSet]);

  const onSubmit = (data: z.infer<typeof sprintFormSchema>) => {
    if (mode === "create") {
      createSprint(
        {
          project: parseInt(data.project_id),
          name: data.name,
          estimated_start: data.start_date,
          estimated_finish: data.end_date,
        },
        {
          onSuccess: () => {
            form.reset({
              name: "",
              project_id: project?.id?.toString() || "",
              version: "",
              start_date: "",
              end_date: "",
            });

            if (onSuccess) {
              onSuccess();
            }
          },
        },
      );
    } else if (mode === "edit" && sprint?.id) {
      editSprint(
        {
          id: sprint.id,
          project: parseInt(data.project_id),
          name: data.name,
          version: data.version ? parseInt(data.version) : undefined,
          estimated_start: data.start_date,
          estimated_finish: data.end_date,
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

  // Always show all form fields regardless of mode
  const filteredFormFields = sprintFormFields.filter((field) => {
    return !field.hidden || field.name === "project_id";
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
                {!field.hidden && (
                  <FormLabel>
                    {field.label}
                    {field.name.includes("date") && " *"}
                  </FormLabel>
                )}
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
                      required={true}
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              {mode === "create" ? "Creating Sprint..." : "Updating Sprint..."}
            </>
          ) : mode === "create" ? (
            "Create Sprint"
          ) : (
            "Update Sprint"
          )}
        </Button>
      </form>
    </Form>
  );
}
