"use client";

import { useParams } from "next/navigation";
import { useGetProjectBySlug } from "@/api/project/queries";
import {
  useGetTaskByProjectId,
  useGetTaskByRefWithProjectIdAndUserStoryId,
} from "@/api/task/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { formatDate } from "@/utils";
import SlugTaskStatusForm from "@/components/organisms/slug-content/backlog/form/task/slug-task-status-form";
import { useEditTask } from "@/api/task/mutation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlugTaskDialog from "@/components/organisms/slug-content/backlog/dialog/task/slug-task-dialog";

export default function SlugTaskContent() {
  const params = useParams();
  const slug = params.slug as string;
  const ref = params.id as string;

  const { data: project } = useGetProjectBySlug(slug);
  const projectId = project?.id?.toString() || "";

  // Step 1: Get all tasks for the project
  const { data: tasksResponse, isLoading: isLoadingTasks } =
    useGetTaskByProjectId(projectId);

  // Step 2: Find the specific task to get its user story ID
  const tasks = Array.isArray(tasksResponse) ? tasksResponse : [];
  const taskPreview = tasks.find((t) => t.ref?.toString() === ref);
  const userStoryId = taskPreview?.user_story?.toString() || "";

  // Step 3: Use the specific API to get detailed task info
  const { data: taskDetail, isLoading: isLoadingDetail } =
    useGetTaskByRefWithProjectIdAndUserStoryId(projectId, userStoryId, ref);

  const { mutate: editTask } = useEditTask();

  // Use the detailed task if available, otherwise use the preview
  const task = taskDetail || taskPreview || null;
  const isLoading = isLoadingTasks || (!!userStoryId && isLoadingDetail);

  const handleStatusChange = (newStatusValue: number) => {
    if (!task || !task.id) return;

    editTask({
      id: task.id,
      status: newStatusValue,
      project: task.project || parseInt(projectId),
      user_story: task.user_story,
      subject: task.subject || "",
      version: task.version,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading task details...</Typography>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">Task not found</p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            The requested task could not be found or you may not have permission
            to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-md"
            style={{
              backgroundColor: task.status_extra_info?.color || "#70728F",
            }}
          >
            <Typography className="font-bold text-white">
              #{task.ref}
            </Typography>
          </div>
          <div>
            <Typography size="h3">{task.subject}</Typography>
            <div className="flex items-center gap-1">
              <span
                style={{
                  color: task.status_extra_info?.color || "#70728F",
                }}
                className="font-medium"
              >
                {task.status_extra_info?.name || "New"}
              </span>
              <span>•</span>
              <span className="font-medium">
                {task.is_closed ? "Closed" : "Open"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center gap-2">
          <SlugTaskDialog
            mode="edit"
            task={task}
            userStoryId={userStoryId}
            trigger={
              <Button
                variant="outline"
                className="inline-flex items-center justify-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            }
          />
          <SlugTaskStatusForm
            tasks={[task]}
            taskStatus={task.status}
            onStatusChange={handleStatusChange}
            className="w-full lg:w-[200px]"
          />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Typography className="font-semibold">Created Date</Typography>
              <Typography>
                {task.created_date ? formatDate(task.created_date) : "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Modified Date</Typography>
              <Typography>
                {task.modified_date ? formatDate(task.modified_date) : "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Due Date</Typography>
              <Typography>
                {task.due_date ? formatDate(task.due_date) : "Not set"}
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Typography className="font-semibold">Owner</Typography>
              <Typography>
                {task.owner_extra_info?.full_name_display || "N/A"}
              </Typography>
            </div>
            <div>
              <Typography className="font-semibold">Assigned To</Typography>
              <Typography>
                {task.assigned_to_extra_info?.full_name_display || "Unassigned"}
              </Typography>
            </div>
            {task.user_story_extra_info && (
              <div>
                <Typography className="font-semibold">User Story</Typography>
                <Typography>
                  #{task.user_story_extra_info?.ref} -{" "}
                  {task.user_story_extra_info?.subject || "N/A"}
                </Typography>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {task.description_html && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: task.description_html }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
