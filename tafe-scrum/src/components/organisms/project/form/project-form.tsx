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
import { Checkbox } from "@/components/ui/checkbox";
import { projectFormFields, projectFormSchema } from "@/api/project/schema";
import { useCreateProject, useEditProject } from "@/api/project/mutation";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { ProjectProps } from "@/api/project/type";
import { useEffect } from "react";

interface ProjectFormProps {
  onSuccess?: () => void;
  project?: ProjectProps;
  mode: "create" | "edit";
}

export default function ProjectForm({
  onSuccess,
  project,
  mode,
}: ProjectFormProps) {
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: editProject, isPending: isEditing } = useEditProject();
  const isPending = isCreating || isEditing;

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_private: false,
      is_epics_activated: true,
    },
  });

  // Load project data when in edit mode
  useEffect(() => {
    if (mode === "edit" && project) {
      form.setValue("name", project.name || "");
      form.setValue("description", project.description || "");
      form.setValue("is_private", project.is_private || false);
      form.setValue("is_epics_activated", project.is_epics_activated || true);
    }
  }, [project, mode, form]);

  const onSubmit = (data: z.infer<typeof projectFormSchema>) => {
    if (mode === "create") {
      createProject(data, {
        onSuccess: () => {
          form.reset({
            name: "",
            description: "",
            is_private: false,
            is_epics_activated: true,
          });

          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } else if (mode === "edit" && project?.id) {
      editProject(
        {
          ...data,
          id: project.id,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {projectFormFields.map((field) => (
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
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      {...fieldProps}
                      value={fieldProps.value as string}
                    />
                  </FormControl>
                )}
                {field.type === "textarea" && (
                  <FormControl>
                    <Textarea
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      {...fieldProps}
                      value={fieldProps.value as string}
                    />
                  </FormControl>
                )}
                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        id={field.name}
                        checked={fieldProps.value as boolean}
                        onCheckedChange={fieldProps.onChange}
                      />
                    </FormControl>
                    <Label
                      htmlFor={field.name}
                      className="!text-sm !font-normal"
                    >
                      {field.label}
                    </Label>
                  </div>
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
              <LoaderCircle className="animate-spin" />
              {mode === "create"
                ? "Creating Project..."
                : "Updating Project..."}
            </>
          ) : mode === "create" ? (
            "Create Project"
          ) : (
            "Update Project"
          )}
        </Button>
      </form>
    </Form>
  );
}
