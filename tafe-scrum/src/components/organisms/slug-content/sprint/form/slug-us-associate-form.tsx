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
import { Button } from "@/components/ui/button";
import { sprintAssociatedUsFormSchema } from "@/api/sprint/schema";
import { useAssociateUserStoriesToSprint } from "@/api/backlog-us/mutation";
import { z } from "zod";
import { SprintProps } from "@/api/sprint/type";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import { useGetUserStoryByProjectId } from "@/api/backlog-us/queries";
import type { UserStoryProps } from "@/api/backlog-us/type";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SlugAssociateUsFormProps {
  onSuccess?: () => void;
  sprint: SprintProps;
}

type FormValues = z.infer<typeof sprintAssociatedUsFormSchema>;

export default function SlugUsAssociateForm({
  onSuccess,
  sprint,
}: SlugAssociateUsFormProps) {
  const params = useParams();
  const slug = params.slug as string;
  const { data: project } = useGetProjectBySlug(slug);
  const { data: userStories } = useGetUserStoryByProjectId(
    project?.id?.toString() || "",
  );
  const [selectedUserStories, setSelectedUserStories] = useState<number[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { mutate: associateUserStories, isPending } =
    useAssociateUserStoriesToSprint();

  const form = useForm<FormValues>({
    resolver: zodResolver(sprintAssociatedUsFormSchema),
    defaultValues: {
      project_id: "",
      milestone_id: "",
      bulk_userstories: [],
    },
  });

  // Update form values when project and sprint change
  useEffect(() => {
    if (project?.id) {
      form.setValue("project_id", project.id.toString());
    }
    if (sprint?.id) {
      form.setValue("milestone_id", sprint.id.toString());
    }
  }, [project, sprint, form]);

  const onSubmit = form.handleSubmit((data) => {
    associateUserStories(
      {
        projectId: parseInt(data.project_id),
        milestoneId: parseInt(data.milestone_id),
        userStoryIds: data.bulk_userstories,
      },
      {
        onSuccess: () => {
          form.reset({
            project_id: project?.id?.toString() || "",
            milestone_id: sprint?.id?.toString() || "",
            bulk_userstories: [],
          });
          setSelectedUserStories([]);

          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  });

  // Filter out user stories that are already associated with this sprint
  const alreadyAssociatedIds = sprint?.user_stories
    ? sprint.user_stories.map((story: UserStoryProps) => story.id)
    : [];

  const availableUserStories = Array.isArray(userStories)
    ? userStories.filter((story) => !alreadyAssociatedIds.includes(story.id))
    : [];

  const handleSelectUserStory = (storyId: number) => {
    const currentValue = [...selectedUserStories];
    const storyIdIndex = currentValue.indexOf(storyId);

    if (storyIdIndex === -1) {
      currentValue.push(storyId);
    } else {
      currentValue.splice(storyIdIndex, 1);
    }

    setSelectedUserStories(currentValue);
    form.setValue("bulk_userstories", currentValue);
  };

  const removeUserStory = (storyId: number) => {
    const newSelected = selectedUserStories.filter((id) => id !== storyId);
    setSelectedUserStories(newSelected);
    form.setValue("bulk_userstories", newSelected);
  };

  const getStoryById = (id: number) => {
    return availableUserStories.find((story) => story.id === id);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Hidden fields */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="milestone_id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* User Stories multi-select */}
        <FormField
          control={form.control}
          name="bulk_userstories"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select User Stories</FormLabel>

              {/* Selected user stories display */}
              {selectedUserStories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedUserStories.map((storyId) => {
                    const story = getStoryById(storyId);
                    return (
                      <Badge key={storyId} className="flex items-center gap-1">
                        #{story?.ref} {story?.subject?.substring(0, 20)}
                        {story?.subject?.length > 20 ? "..." : ""}
                        <button
                          type="button"
                          onClick={() => removeUserStory(storyId)}
                          className="ml-1 h-4 w-4 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setPopoverOpen(true)}
                    >
                      {selectedUserStories.length > 0
                        ? `${selectedUserStories.length} user ${selectedUserStories.length === 1 ? "story" : "stories"} selected`
                        : "Select user stories"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search user stories..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No available user stories found.
                      </CommandEmpty>
                      <CommandGroup>
                        {availableUserStories.length > 0 ? (
                          availableUserStories.map(
                            (userStory: UserStoryProps) => (
                              <CommandItem
                                key={userStory.id}
                                value={
                                  userStory.subject || `US #${userStory.ref}`
                                }
                                onSelect={() => {
                                  handleSelectUserStory(userStory.id || 0);
                                }}
                              >
                                <div className="flex items-center">
                                  <span className="mr-2">#{userStory.ref}</span>
                                  {userStory.subject}
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedUserStories.includes(
                                      userStory.id || 0,
                                    )
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ),
                          )
                        ) : (
                          <CommandItem disabled>
                            All user stories are already associated with this
                            sprint
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            isPending ||
            availableUserStories.length === 0 ||
            selectedUserStories.length === 0
          }
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Associating User Stories...
            </>
          ) : availableUserStories.length === 0 ? (
            "No Available User Stories"
          ) : selectedUserStories.length === 0 ? (
            "Select User Stories to Associate"
          ) : (
            `Associate ${selectedUserStories.length} User ${selectedUserStories.length === 1 ? "Story" : "Stories"}`
          )}
        </Button>
      </form>
    </Form>
  );
}
