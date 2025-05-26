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
import BacklogForm from "@/components/organisms/backlog/form/backlog-form";
import { UserStoryProps } from "@/api/backlog-us/type";

interface BacklogDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  mode: "create" | "edit";
  userStory?: UserStoryProps;
  onSuccess?: () => void;
}

export default function BacklogDialog({
  trigger,
  title,
  description,
  mode,
  userStory,
  onSuccess,
}: BacklogDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const defaultDescription =
    mode === "create"
      ? "Fill in the details below to create a new user story."
      : "Update the details of your user story.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title ||
              (mode === "create" ? "Create User Story" : "Edit User Story")}
          </DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <BacklogForm
          onSuccess={handleSuccess}
          userStory={userStory}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
