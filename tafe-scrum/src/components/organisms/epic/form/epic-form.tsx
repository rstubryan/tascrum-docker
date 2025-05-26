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
import { epicDetailFormSchema, epicFormSchema } from "@/api/epic/schema";
import { useCreateEpic, useEditEpic } from "@/api/epic/mutation";
import { z } from "zod";
import { CreateEpicProps, EpicProps } from "@/api/epic/type";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { MultiSelect } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";

interface EpicDetailFormProps {
  onSuccess?: () => void;
  epic?: EpicProps;
  mode: "create" | "edit";
}

// Define types for our form values
type ListFormValues = z.infer<typeof epicFormSchema> & {
  selectedMembers?: string[];
};

type DetailFormValues = z.infer<typeof epicDetailFormSchema> & {
  selectedMembers?: string[];
};

export default function EpicDetailForm({
  onSuccess,
  epic,
  mode,
}: EpicDetailFormProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { mutate: createEpic, isPending: isCreating } = useCreateEpic();
  const { mutate: editEpic, isPending: isEditing } = useEditEpic();
  const isPending = isCreating || isEditing;

  // Determine if we're in the detail view by checking if the URL contains an epic ID
  const isDetailView =
    pathname.includes("/epics/") && !pathname.endsWith("/epics");

  // Create separate form handlers for list and detail views
  const listForm = useForm<ListFormValues>({
    resolver: zodResolver(
      epicFormSchema.extend({
        selectedMembers: z.array(z.string()).optional(),
      }),
    ),
    defaultValues: {
      subject: epic?.subject || "",
      project_id: project?.id?.toString() || "",
      selectedMembers: [],
    },
    mode: "onSubmit",
  });

  const detailForm = useForm<DetailFormValues>({
    resolver: zodResolver(
      epicDetailFormSchema.extend({
        selectedMembers: z.array(z.string()).optional(),
      }),
    ),
    defaultValues: {
      description: epic?.description || "",
      project_id: project?.id?.toString() || "",
      selectedMembers: [],
    },
    mode: "onSubmit",
  });

  // Update form values when project or epic changes
  useEffect(() => {
    if (project?.id) {
      const projectId = project.id.toString();
      listForm.setValue("project_id", projectId);
      detailForm.setValue("project_id", projectId);
    }

    if (epic) {
      if (!isDetailView && epic.subject) {
        listForm.setValue("subject", epic.subject);
      }

      if (isDetailView && epic.description !== undefined) {
        detailForm.setValue("description", epic.description || "");
      }

      // Initialize selected members from assigned_to
      if (epic.assigned_to) {
        const membersToSelect = [epic.assigned_to.toString()];
        setSelectedMembers(membersToSelect);

        if (isDetailView) {
          detailForm.setValue("selectedMembers", membersToSelect);
        } else {
          listForm.setValue("selectedMembers", membersToSelect);
        }
      }
    }
  }, [project, epic, listForm, detailForm, isDetailView]);

  // Handle member selection changes
  const handleMemberSelection = (values: string[]) => {
    setSelectedMembers(values);

    if (isDetailView) {
      detailForm.setValue("selectedMembers", values, { shouldValidate: true });
    } else {
      listForm.setValue("selectedMembers", values, { shouldValidate: true });
    }
  };

  const onSubmit = (data: ListFormValues | DetailFormValues) => {
    // Determine assigned_to based on selected members
    const assigned_to =
      selectedMembers.length > 0 ? parseInt(selectedMembers[0]) : null;

    if (mode === "create") {
      const epicData: CreateEpicProps = {
        subject: isDetailView
          ? "" // Should never happen in UI, but needed for type safety
          : (data as ListFormValues).subject,
        project: parseInt(data.project_id),
        assigned_to,
      };

      createEpic(epicData, {
        onSuccess: () => {
          if (isDetailView) {
            detailForm.reset({
              description: "",
              project_id: project?.id?.toString() || "",
              selectedMembers: [],
            });
          } else {
            listForm.reset({
              subject: "",
              project_id: project?.id?.toString() || "",
              selectedMembers: [],
            });
          }
          setSelectedMembers([]);

          if (onSuccess) {
            onSuccess();
          }
        },
      });
    } else if (mode === "edit" && epic?.id) {
      const epicData = {
        id: epic.id,
        project: parseInt(data.project_id),
        version: epic.version,
        ...(isDetailView
          ? { description: (data as DetailFormValues).description || "" }
          : { subject: (data as ListFormValues).subject || "" }),
        assigned_to,
      };

      editEpic(epicData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    }
  };

  // Prepare member options for the MultiSelect component
  const memberOptions =
    project?.members?.map((member) => ({
      label: member.full_name_display || member.username,
      value: member.id.toString(),
    })) || [];

  return (
    <>
      {isDetailView ? (
        <Form {...detailForm}>
          <form
            onSubmit={detailForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Description field for detail views */}
            <FormField
              control={detailForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      {...field}
                      value={field.value || ""}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project ID field (hidden) */}
            <FormField
              control={detailForm.control}
              name="project_id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="text"
                      required={true}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign Member field for detail views when creating */}
            {mode === "create" && (
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
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" />
                  {mode === "create"
                    ? "Creating Epic..."
                    : "Updating Description..."}
                </>
              ) : mode === "create" ? (
                "Create Epic"
              ) : (
                "Update Description"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...listForm}>
          <form
            onSubmit={listForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Subject field for non-detail views */}
            <FormField
              control={listForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Epic Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required={true}
                      placeholder="Enter epic name"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project ID field (hidden) */}
            <FormField
              control={listForm.control}
              name="project_id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="text"
                      required={true}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign Member field for non-detail views */}
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
                  {mode === "create" ? "Creating Epic..." : "Updating Epic..."}
                </>
              ) : mode === "create" ? (
                "Create Epic"
              ) : (
                "Update Epic"
              )}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
