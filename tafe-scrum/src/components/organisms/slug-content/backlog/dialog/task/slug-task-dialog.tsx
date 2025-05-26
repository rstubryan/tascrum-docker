"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskProps } from "@/api/task/type";
import SlugTaskForm from "@/components/organisms/slug-content/backlog/form/task/slug-task-form";

interface SlugTaskDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  task?: TaskProps;
  userStoryId: string;
  onSuccess?: () => void;
}

export default function SlugTaskDialog({
  trigger,
  title,
  description,
  mode,
  task,
  userStoryId,
  onSuccess,
}: SlugTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new task."
      : "Update the details of your task.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title || (mode === "create" ? "Create Task" : "Edit Task")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <SlugTaskForm
          onSuccess={handleSuccess}
          task={task}
          mode={mode}
          userStoryId={userStoryId}
        />
      </DialogContent>
    </Dialog>
  );
}
