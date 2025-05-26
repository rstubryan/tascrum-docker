// src/components/organisms/slug-content/backlog/slug-backlog-task.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/atoms/typography/typography";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useGetTaskByProjectIdAndUserStoryId } from "@/api/task/queries";
import { useDeleteTask, useEditTask } from "@/api/task/mutation";
import { formatDate } from "@/utils";
import { TaskProps } from "@/api/task/type";
import { PaginationLayout } from "@/components/templates/layout/pagination-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SlugTaskDialog from "./dialog/task/slug-task-dialog";
import SlugTaskStatusForm from "./form/task/slug-task-status-form";

interface SlugBacklogTaskProps {
  projectId: string;
  userStoryId: string;
}

export default function SlugBacklogTask({
  projectId,
  userStoryId,
}: SlugBacklogTaskProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: tasksResponse, isLoading: isLoadingTasks } =
    useGetTaskByProjectIdAndUserStoryId(projectId, userStoryId);
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: editTask } = useEditTask();

  const tasks = Array.isArray(tasksResponse) ? tasksResponse : [];
  const taskCount = tasks.length;

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(taskCount / itemsPerPage);

  useEffect(() => {
    if (tasksResponse) {
      setCurrentPage(1);
    }
  }, [tasksResponse]);

  const handleDeleteTask = (taskId: number | undefined) => {
    if (taskId) {
      deleteTask(taskId.toString(), {});
    }
  };

  const handleStatusChange = (
    taskId: number | undefined,
    newStatusValue: number,
  ) => {
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    editTask({
      id: taskId,
      status: newStatusValue,
      project: task.project || parseInt(projectId),
      user_story: task.user_story || parseInt(userStoryId),
      subject: task.subject || "",
      version: task.version,
    });
  };

  if (isLoadingTasks) {
    return (
      <div className="flex items-center justify-center h-40">
        <Typography>Loading tasks...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-primary text-2xl font-semibold tracking-tight scroll-m-20">
          Tasks ({taskCount})
        </p>

        <SlugTaskDialog
          mode="create"
          userStoryId={userStoryId}
          trigger={
            <Button className="inline-flex items-center justify-center gap-2">
              <Plus />
              Create Task
            </Button>
          }
        />
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <p className="text-primary leading-7 scroll-m-20">
            No tasks found for this user story
          </p>
          <p className="text-primary scroll-m-20 mt-1 muted text-sm">
            Click the &#34;Create Task&#34; button to add your first task
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTasks.map((task: TaskProps) => (
            <Card key={task.id} className="flex flex-col h-full">
              <CardHeader className="pb-0">
                <div className="2xl:flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md"
                      style={{
                        backgroundColor:
                          task.status_extra_info?.color || "#70728F",
                      }}
                    >
                      <Typography className="font-bold text-white">
                        #{task.ref}
                      </Typography>
                    </div>
                    <div>
                      <CardTitle className="line-clamp-1">
                        {task.subject}
                      </CardTitle>
                      <CardContent className="p-0">
                        <Typography className="flex gap-1 text-xs text-muted-foreground">
                          <span
                            style={{
                              color: task.status_extra_info?.color || "#70728F",
                            }}
                          >
                            {task.status_extra_info?.name || "New"}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {task.is_closed ? "Closed" : "Open"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>

                  <SlugTaskStatusForm
                    className={"mt-4 2xl:mt-0 2xl:w-[150px] w-full"}
                    tasks={tasks}
                    taskStatus={task.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(task.id, newStatus)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="mb-2 grid grid-cols-1 gap-1 text-sm">
                    <div>
                      <span className="font-semibold">Created:</span>{" "}
                      {task.created_date
                        ? formatDate(task.created_date)
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Owner:</span>{" "}
                      {task.owner_extra_info?.full_name_display || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Assigned:</span>{" "}
                      {task.assigned_to_extra_info?.full_name_display ||
                        "Unassigned"}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold">User Story:</span>{" "}
                      {task.user_story_extra_info?.subject || "N/A"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <SlugTaskDialog
                  mode="edit"
                  task={task}
                  userStoryId={userStoryId}
                  trigger={
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center gap-2 w-full"
                      size="sm"
                    >
                      <Pencil />
                      <span className="sm:hidden inline">Edit</span>
                    </Button>
                  }
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center justify-center gap-2 w-full"
                    >
                      <Trash2 />
                      <span className="sm:hidden inline">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-bold">
                          &#34;{task.subject}&#34;
                        </span>
                        ? This action cannot be undone and will permanently
                        remove this task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => task.id && handleDeleteTask(task.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationLayout
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
